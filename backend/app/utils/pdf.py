from io import BytesIO
from typing import Dict
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


def generate_report_pdf(data: Dict) -> BytesIO:
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=20*mm, bottomMargin=20*mm)
    styles = getSampleStyleSheet()
    story = []
    width = A4[0] - 40*mm

    title_style = ParagraphStyle(
        "CustomTitle", parent=styles["Title"],
        fontSize=22, textColor=colors.HexColor("#1a365d"),
        spaceAfter=6, alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        "Heading2", parent=styles["Heading2"],
        fontSize=14, textColor=colors.HexColor("#2d3748"),
        spaceBefore=12, spaceAfter=6,
    )
    normal_style = ParagraphStyle(
        "CustomNormal", parent=styles["Normal"],
        fontSize=10, leading=14,
    )

    story.append(Paragraph("MarketMind Labs", title_style))
    story.append(Paragraph("Probability &amp; Market Structure Analysis Report", ParagraphStyle(
        "Sub", parent=styles["Normal"], fontSize=11,
        textColor=colors.HexColor("#718096"), alignment=TA_CENTER, spaceAfter=12,
    )))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0")))
    story.append(Spacer(1, 8*mm))

    report_type = data.get("report_type", "Unknown")
    market = data.get("market", "NIFTY")
    story.append(Paragraph(f"Report Type: {report_type} | Market: {market}", heading_style))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                           ParagraphStyle("Small", parent=normal_style, fontSize=9, textColor=colors.gray)))
    story.append(Spacer(1, 6*mm))

    output = data.get("output", {})
    rows = [["Metric", "Value"]]
    for key, val in output.items():
        if isinstance(val, dict):
            continue
        label = key.replace("_", " ").title()
        value = str(val) if val is not None else "N/A"
        rows.append([label, value])

    table = Table(rows, colWidths=[width * 0.4, width * 0.6])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a365d")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7fafc")]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
    story.append(Spacer(1, 10*mm))

    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
    story.append(Spacer(1, 6*mm))

    disclaimer_style = ParagraphStyle(
        "Disclaimer", parent=styles["Normal"],
        fontSize=8, textColor=colors.HexColor("#a0aec0"),
        alignment=TA_CENTER,
    )
    story.append(Paragraph(
        "Disclaimer: This platform provides educational and analytical information only. "
        "No investment advice is provided. Trading involves risk. "
        "Past performance does not guarantee future results.",
        disclaimer_style,
    ))

    doc.build(story)
    buf.seek(0)
    return buf
