export function generateUUID() { // created by ChatGPT
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return uuid;
}

function getHourDifference(epochTimestamp) {
    // Convert epoch timestamp to milliseconds
    const timestampMs = epochTimestamp * 1000;

    // Get the current time in milliseconds
    const nowMs = Date.now();

    // Calculate the time difference in milliseconds
    const differenceMs = nowMs - timestampMs;

    // Convert milliseconds to hours
    const hours = differenceMs / (1000 * 60 * 60);

    // Round to the nearest tenth
    const roundedHours = Math.round(hours * 10) / 10; // nearest tenth of an hour

    return roundedHours;
}

export function getPrettyTimeDiff(epochTimeStamp){
    const hourDif = getHourDifference(epochTimeStamp)
    if (hourDif < 1){
        return `${Math.round(hourDif * 60)}m`
    }
    else if (hourDif < 24) {
        return `${hourDif}h`
    }
    const dayDif = Math.round(hourDif / 24)
    if (dayDif < 30){
        return `${dayDif}d`
    }
    const monthDif = dayDif / 30 // approximate
    if (monthDif < 12){
        return (`${Math.round(monthDif)}m`)
    }
    const yearDif = monthDif / 12
    const roundedYearDif = Math.round(yearDif * 10) * 10 // nearest 10th
    return `${roundedYearDif}y`
}