import argparse
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


def clean_name(s: str) -> str:
    s = (s or "").strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[^A-Za-z0-9 _\-\./&]", "", s)
    s = s.replace(" & ", " and ").replace("&", "and").replace(" ", "_")
    s = s.replace("/", "_").replace("\\", "_")
    return (s[:80] or "image").strip("_") or "image"


def read_xml(zipf: zipfile.ZipFile, name: str) -> ET.Element:
    return ET.fromstring(zipf.read(name).decode("utf-8", errors="ignore"))


def extract_images(docx_path: Path, out_dir: Path) -> list[tuple[str, str]]:
    out_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(docx_path) as z:
        rels_root = read_xml(z, "word/_rels/document.xml.rels")
        doc_root = read_xml(z, "word/document.xml")

        rel_map: dict[str, str] = {}
        for rel in rels_root.findall(
            "{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"
        ):
            rid = rel.attrib.get("Id")
            target = rel.attrib.get("Target")
            if rid and target and target.startswith("media/"):
                rel_map[rid] = "word/" + target

        images_in_order: list[tuple[str, str]] = []
        last_text = ""
        for p in doc_root.findall(".//w:p", NS):
            texts = [t.text or "" for t in p.findall(".//w:t", NS)]
            ptxt = "".join(texts).strip()
            if ptxt:
                last_text = ptxt

            for blip in p.findall(".//a:blip", NS):
                rid = blip.attrib.get(f"{{{NS['r']}}}embed")
                if not rid:
                    continue
                target = rel_map.get(rid)
                if not target:
                    continue
                images_in_order.append((target, last_text))

        seen: set[str] = set()
        extracted: list[tuple[str, str]] = []
        for idx, (target, label) in enumerate(images_in_order, start=1):
            if target in seen:
                continue
            seen.add(target)
            ext = Path(target).suffix.lower()
            safe = clean_name(label or f"image_{idx}")
            out_name = f"{idx:02d}_{safe}{ext}"
            out_path = out_dir / out_name
            out_path.write_bytes(z.read(target))
            extracted.append((out_name, label))

    return extracted


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("docx", type=Path)
    parser.add_argument("out_dir", type=Path)
    args = parser.parse_args()

    extracted = extract_images(args.docx, args.out_dir)
    print(f"Extracted {len(extracted)} image(s) to {args.out_dir}")
    for name, label in extracted:
        label_txt = (label or "").strip()
        print(f"- {name}" + (f"  <=  {label_txt}" if label_txt else ""))


if __name__ == "__main__":
    main()
