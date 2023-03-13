export const handlePrintTicketAgain = ({ data, count, setCount }) => {
    setCount(count + 1);
    // Printer.print(
    //     (printer) =>
    //         new Promise((finishPrint) => {
    //             setLoading(true);
    //             setTimeout(() => {
    //                 setLoading(false);
    //             }, 5000);

    //             printer
    //                 .align("ct")
    //                 .style("normal")
    //                 .size(1, 1)
    //                 .style("b")
    //                 .text("CASINO CENTRAL")
    //                 .feed(1)
    //                 .size(0, 0)
    //                 .text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
    //                 .feed(1)
    //                 .size(2, 3)
    //                 .text("VALE EN EFECTIVO")
    //                 .feed(1)
    //                 .feed(1)
    //                 .barcode(`${data.Barcode}`, "ITF", {
    //                     width: 2,
    //                     position: "off",
    //                 })
    //                 .feed(1)
    //                 .size(0, 0)
    //                 .text(`${ticketData?.Barcode}`)

    //                 .feed(2)
    //                 .size(1, 0)
    //                 .text(parsedDatePrint)
    //                 .feed(1)
    //                 .size(2, 2)
    //                 .text(`$${parsedValue} ARS`)
    //                 .feed(1)
    //                 .size(0, 0)
    //                 .tableCustom(
    //                     [
    //                         {
    //                             text: "VALIDO POR ",
    //                             align: "CENTER",
    //                             width: 1,
    //                         },
    //                         {
    //                             text: `MAQUINA N° `,
    //                             align: "CENter",
    //                             width: 1,
    //                         },
    //                     ],
    //                     "cp857"
    //                 )
    //                 .tableCustom(
    //                     [
    //                         {
    //                             text: "30 DIAS",
    //                             align: "CENTER",
    //                             width: 1,
    //                         },
    //                         {
    //                             text: `${data?.PrintedIn}`,
    //                             align: "CENter",
    //                             width: 1,
    //                         },
    //                     ],
    //                     "cp857"
    //                 )

    //                 .feed(2)
    //                 .tableCustom(
    //                     [
    //                         {
    //                             text: "AUTORIZA:",
    //                             align: "CENTER",
    //                             width: 1,
    //                         },
    //                         {
    //                             text: `LEGAJO: `,
    //                             align: "CENter",
    //                             width: 1,
    //                         },
    //                     ],
    //                     "cp857"
    //                 )
    //                 .feed(1)
    //                 .tableCustom(
    //                     [
    //                         {
    //                             text: "______________",
    //                             align: "CENTER",
    //                             width: 1,
    //                         },
    //                         {
    //                             text: "______________",
    //                             align: "CENter",
    //                             width: 1,
    //                         },
    //                     ],
    //                     "cp857"
    //                 )
    //                 .feed(2)
    //                 .size(1, 0)
    //                 .text("Solo cobrar por caja")
    //                 .feed(2)
    //                 .size(0, 0)
    //                 .text(`${"Re-impresion N°" + count}`);

    //             finishPrint();
    //         }),
    //     (onError) => {
    //         console.log("ERROR Asking for printer", onError);
    //         NotifyUser.Error("Problemas comunicando con la impresora.");
    //     }
    // );
};