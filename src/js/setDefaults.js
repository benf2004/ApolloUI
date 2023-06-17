export function checkDefaults(){
    const defaultsSet = localStorage.getItem("defaultsSet")
    if (defaultsSet === null || defaultsSet === undefined) {
        localStorage.setItem("mainSortMode", "best")

        localStorage.setItem("defaultsSet", "true")
    }
}