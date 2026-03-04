function Pets() {

    async function getpets() {
      const res = await fetch("http://localhost:5000/getpets", {
        method:"POST",
        credentials:"include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      })
    }
    return (
        <>
        <div></div>
        </>
    );
}

export default Pets;