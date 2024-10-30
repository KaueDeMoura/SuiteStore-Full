export default function getHttp(url) {
    axios.get(url).then(response => response.data)
}


