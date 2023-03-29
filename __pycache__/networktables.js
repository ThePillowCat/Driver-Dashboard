let fetch = import('node-fetch')
const read = () => {
    fetch('NetworkTables/arm.json')
        .then((response) => response.json())
        .then((json) => console.log(json));
}
read()