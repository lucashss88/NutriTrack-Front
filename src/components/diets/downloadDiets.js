import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export function generatePDF(diet) {
    const doc = new jsPDF();
    const margin = 20; // Margem padrão
    let yPos = margin; // Posição Y atual no documento

    // Título Principal
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50); // Cor de texto mais escura para títulos
    doc.text('Relatório de Dieta NutriTrack', margin, yPos);
    yPos += 15;

    // Informações Básicas da Dieta
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Paciente: ${diet.patient?.username || 'N/A'}`, margin, yPos);
    yPos += 7;
    doc.text(`Data de Início: ${new Date(diet.startDate).toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 7;
    doc.text(`Data Final: ${new Date(diet.endDate).toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 15; // Espaço antes da tabela de refeições

    // Tabela de Refeições e Alimentos
    const columns = ["Refeição / Tipo", "Alimento / Item", "Quantidade", "Observação"];
    const rows = [];

    if (diet.Meals && diet.Meals.length > 0) {
        diet.Meals.forEach((meal, mealIndex) => {
            let isFirstFoodInMeal = true; // Flag para garantir que o tipo da refeição e a observação principal apareçam uma vez por refeição

            if (meal.Food && meal.Food.length > 0) {
                meal.Food.forEach((mealFood) => {
                    rows.push([
                        isFirstFoodInMeal ? meal.type : '', // Mostra o tipo da refeição apenas na primeira linha
                        mealFood.name,
                        `${mealFood.MealFood?.quantity || 0}g`, // Acesso seguro à quantidade
                        isFirstFoodInMeal && meal.observation ? meal.observation : '' // Mostra a observação principal apenas na primeira linha
                    ]);
                    isFirstFoodInMeal = false; // Desativa a flag após a primeira linha
                });
            } else {
                // Se a refeição não tiver alimentos, adiciona uma linha indicando
                rows.push([meal.type, 'Nenhum alimento especificado.', '', meal.observation || '']);
            }

            // Adiciona um separador entre as refeições, se não for a última
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
        startY: yPos, // Inicia a tabela após as informações básicas
        headStyles: { fillColor: [126, 190, 104], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 255, 240] },
        styles: { fontSize: 10, cellPadding: 3, rowPageBreak: 'auto', halign: 'left', valign: 'middle' },
        columnStyles: {
            0: { cellWidth: 40 }, // Refeição / Tipo
            1: { cellWidth: 'auto' }, // Alimento / Item
            2: { cellWidth: 25, halign: 'center' }, // Quantidade
            3: { cellWidth: 'auto' } // Observação
        },
        // Callback para adicionar cabeçalho/rodapé em cada página (se a tabela for longa)
        didDrawPage: function (data) {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Gerado por NutriTrack - Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
        // Callback para estilos de células específicas
        didParseCell: function (data) {
            if (data.section === 'head') {
                data.cell.styles.fillColor = [126, 190, 104]; // Corrigindo a cor do cabeçalho
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
                        indent: { left: 720 }, // 0.5 inch (720 twips = 0.5 inch)
                        font: "Arial",
                        size: 20, // 10pt
                        run: { italics: true }
                    })
                );
            }

            const mealFoodsTableRows = [];
            // Header for food table within meal
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
                    margins: { // Adiciona margens à tabela para separá-la
                        top: 100,
                        bottom: 100,
                        left: 100
                    }
                })
            );

            // Add substitutes if any
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
                                size: 18, // 9pt
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
                            margins: { // Margens para tabelas de substitutos
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
};
