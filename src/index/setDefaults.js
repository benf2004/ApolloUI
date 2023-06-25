export function checkDefaults(){
    const defaultsSet = localStorage.getItem("defaultsSet")
    if (!defaultsSet) {
        localStorage.setItem("mainSortMode", "best")
        localStorage.setItem("defaultsSet", "true")
    }
}