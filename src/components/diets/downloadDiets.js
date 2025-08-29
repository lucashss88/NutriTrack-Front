import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export function generatePDF(diet) {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text('Relatório de Dieta NutriTrack', margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Paciente: ${diet.patient?.username || 'N/A'}`, margin, yPos);
    yPos += 7;
    doc.text(`Data de Início: ${new Date(diet.startDate).toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 7;
    doc.text(`Data Final: ${new Date(diet.endDate).toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 15;

    const columns = ["Refeição / Tipo", "Alimento / Item", "Quantidade", "Observação"];
    const rows = [];

    if (diet.Meals && diet.Meals.length > 0) {
        diet.Meals.forEach((meal, mealIndex) => {
            let isFirstFoodInMeal = true;

            if (meal.Food && meal.Food.length > 0) {
                meal.Food.forEach((mealFood) => {
                    rows.push([
                        isFirstFoodInMeal ? meal.type : '',
                        mealFood.name,
                        `${mealFood.MealFood?.quantity || 0}g`,
                        isFirstFoodInMeal && meal.observation ? meal.observation : ''
                    ]);
                    isFirstFoodInMeal = false;
                });
            } else {
                rows.push([meal.type, 'Nenhum alimento especificado.', '', meal.observation || '']);
            }

            if (mealIndex < diet.Meals.length - 1) {
                rows.push([{ content: '', colSpan: columns.length, styles: { minCellHeight: 5, fillColor: [230, 230, 230] } }]);
            }
        });
    } else {
        rows.push([{ content: 'Nenhuma refeição configurada para esta dieta.', colSpan: columns.length, styles: { fontStyle: 'italic', textColor: [150, 150, 150] } }]);
    }

    doc.autoTable({
        head: [columns],
        body: rows,
        startY: yPos,
        headStyles: { fillColor: [126, 190, 104], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 255, 240] },
        styles: { fontSize: 10, cellPadding: 3, rowPageBreak: 'auto', halign: 'left', valign: 'middle' },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 'auto' }
        },
        didDrawPage: function (data) {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Gerado por NutriTrack - Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
        didParseCell: function (data) {
            if (data.section === 'head') {
                data.cell.styles.fillColor = [126, 190, 104];
                data.cell.styles.textColor = [255, 255, 255];
            }
        }
    });

    doc.save(`relatorio_dieta_${diet.patient?.username || 'paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
}

export function generateDOCX(diet) {
    if (!diet || !diet.Meals) {
        console.error("Dieta ou refeições não estão disponíveis para DOCX.");
        return;
    }

    const sectionsChildren = [
        new Paragraph({
            text: `Relatório de Dieta - Paciente: ${diet.patient?.username || 'N/A'}`,
            heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
            text: `Período: ${new Date(diet.startDate).toLocaleDateString('pt-BR')} a ${new Date(diet.endDate).toLocaleDateString('pt-BR')}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
        }),
    ];

    if (diet.Meals.length === 0) {
        sectionsChildren.push(new Paragraph({ text: 'Nenhuma refeição configurada para esta dieta.', alignment: 'center', spacing: { before: 200 } }));
    } else {
        diet.Meals.forEach((meal) => {
            sectionsChildren.push(
                new Paragraph({
                    text: `Refeição: ${meal.type}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 100 }
                })
            );
            if (meal.observation) {
                sectionsChildren.push(
                    new Paragraph({
                        text: `Observação: ${meal.observation}`,
                        heading: HeadingLevel.TEXT,
                        indent: { left: 720 },
                        font: "Arial",
                        size: 20,
                        run: { italics: true }
                    })
                );
            }

            const mealFoodsTableRows = [];
            mealFoodsTableRows.push(
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Alimento")] }),
                        new TableCell({ children: [new Paragraph("Quantidade")] }),
                    ],
                    tableHeader: true,
                })
            );

            if (meal.Food && meal.Food.length > 0) {
                meal.Food.forEach((mealFood) => {
                    mealFoodsTableRows.push(
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(mealFood.name)] }),
                                new TableCell({ children: [new Paragraph(`${mealFood.MealFood?.quantity || 0}g`)] }), // Acesso seguro
                            ],
                        })
                    );
                });
            } else {
                mealFoodsTableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph('Nenhum alimento especificado.')], colSpan: 2 }),
                        ],
                    })
                );
            }

            sectionsChildren.push(
                new Table({
                    rows: mealFoodsTableRows,
                    width: {
                        size: 80,
                        type: WidthType.PERCENTAGE,
                    },
                    margins: {
                        top: 100,
                        bottom: 100,
                        left: 100
                    }
                })
            );

            if (meal.Substitutes && meal.Substitutes.length > 0) {
                sectionsChildren.push(
                    new Paragraph({
                        text: "Opções de Substituição:",
                        heading: HeadingLevel.HEADING_4,
                        spacing: { before: 200, after: 100 }
                    })
                );
                meal.Substitutes.forEach(substituteMeal => {
                    sectionsChildren.push(
                        new Paragraph({
                            text: `${substituteMeal.type} (Substituto)`,
                            heading: HeadingLevel.HEADING_5,
                            spacing: { before: 50, after: 20 }
                        })
                    );
                    if (substituteMeal.observation) {
                        sectionsChildren.push(
                            new Paragraph({
                                text: `Obs. Subst.: ${substituteMeal.observation}`,
                                heading: HeadingLevel.TEXT,
                                indent: { left: 720 },
                                font: "Arial",
                                size: 18,
                                run: { italics: true }
                            })
                        );
                    }

                    const substituteFoodsTableRows = [];
                    substituteFoodsTableRows.push(
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Alimento (Subst.)")] }),
                                new TableCell({ children: [new Paragraph("Quantidade (Subst.)")] }),
                            ],
                            tableHeader: true,
                        })
                    );
                    if (substituteMeal.Foods && substituteMeal.Foods.length > 0) {
                        substituteMeal.Foods.forEach(substituteFood => {
                            substituteFoodsTableRows.push(
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph(substituteFood.name)] }),
                                        new TableCell({ children: [new Paragraph(`${substituteFood.MealFood?.quantity || 0}g`)] }),
                                    ],
                                })
                            );
                        });
                    } else {
                        substituteFoodsTableRows.push(
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph('Nenhum alimento substituto especificado.')], colSpan: 2 }),
                                ],
                            })
                        );
                    }
                    sectionsChildren.push(
                        new Table({
                            rows: substituteFoodsTableRows,
                            width: {
                                size: 70,
                                type: WidthType.PERCENTAGE,
                            },
                            margins: {
                                top: 50,
                                bottom: 50,
                                left: 100
                            }
                        })
                    );
                });
            }
        });
    }


    const doc = new Document({
        sections: [{
            children: sectionsChildren,
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `relatorio_dieta_${diet.patient?.username || 'paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.docx`);
    }).catch((error) => {
        console.error("Erro ao gerar o arquivo DOCX:", error);
    });
}
