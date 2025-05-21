import jsPDF from "jspdf";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export function generatePDF(diet) {
    const doc = new jsPDF();

    doc.text('Relatório de Dieta', 20, 10);

    // Tabela de Refeições e Alimentos
    const columns = ["Refeição", "Alimento", "Quantidade"];
    const rows = [];

    diet.Meals.forEach((meal) => {
        meal.Food.forEach((mealFood) => {
            rows.push([meal.type, mealFood.name, `${mealFood.MealFood.quantity}g`]);
        });
    });

    doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20,
        headStyles: { fillColor: [126, 190, 104] },
    });

    doc.save('relatorio_dieta.pdf');
};

export function generateDOCX(diet) {
    if (!diet || !diet.Meals) {
        console.error("Dieta ou refeições não estão disponíveis.");
        return;
    }

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    text: "Relatório de Dieta",
                    heading: HeadingLevel.TITLE,
                }),
                new Table({
                    rows: diet.Meals.map((meal) =>
                        new TableRow({
                            children: meal.Food.map((mealFood) =>
                                new TableCell({
                                    children: [new Paragraph(`${meal.type}: ${mealFood.name} - ${mealFood.MealFood.quantity}g`)],
                                })
                            ),
                        })
                    ),
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                }),
            ],
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "relatorio_dieta.docx");
    }).catch((error) => {
        console.error("Erro ao gerar o arquivo DOCX:", error);
    });
};