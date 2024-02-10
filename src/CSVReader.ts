import Papa, {ParseResult} from 'papaparse';

const readAndParseCsvFile = async (filePath: string): Promise<any[]> => {
    const rawRows = await readCsvFile(filePath);
    const parsedRows: any[] = []
    const headers: string[] = rawRows[0];
    rawRows.forEach((row, index) => {
        if (index === 0) {
            return;
        }
        try {
            const parsedRow: any = {};
            headers.forEach((header: string, index) => {
                parsedRow[header] = row[index];
            })
            parsedRows.push(parsedRow);
        } catch (e) {
            console.log(e);
            console.log(`could not parse ${row}`);
        }
    })
    return parsedRows;
}

const readCsvFile = async (filePath: string): Promise<any[]> => {
    return fetch( filePath )
        .then( response => response.text() )
        .then( responseText => {
            // -- parse csv
            return Papa.parse(responseText).data;
        });
};

export default readAndParseCsvFile;
