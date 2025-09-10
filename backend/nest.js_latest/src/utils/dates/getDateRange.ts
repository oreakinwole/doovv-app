//functions returns correct start and end date format.
//follow UTC format
export const getDateRange = ( date: Date = new Date()) => {

    const startOfDate = new Date(Date.UTC(
        date.getUTCFullYear(), 
        date.getUTCMonth(), 
        date.getUTCDate(), 0, 0, 0)
    );

    const endOfDate = new Date(
        Date.UTC(
        date.getUTCFullYear(), 
        date.getUTCMonth(), 
        date.getUTCDate(), 23, 59, 59, 999)
    );

    return { startOfDate, endOfDate }
}
