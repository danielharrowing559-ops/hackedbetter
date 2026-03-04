import { useEffect, useState } from "react";
import "./Pets.css";

function Pets() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
    async function getPets() {
        try {
        const res = await fetch("http://localhost:5000/getpets", {
            credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch pets");

        const data = await res.json();
        console.log("Server response:", data);

        setPets(Array.isArray(data) ? data : data.pets);
        setLoading(false);
        } catch (err) {
        setError(err.message);
        setLoading(false);
        }
    }

    getPets();
    }, []);

  async function handleSelect(petId) {
    try {
      const res = await fetch("http://localhost:5000/selectpet", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"pet_id": petId }),
      });

      if (!res.ok) throw new Error("Failed to save pet");

      setSelectedPetId(petId);
      alert("Pet selected successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading pets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="petsPage">
      <h2>Choose Your Pet</h2>

      <div className="petsGrid">
        {pets.slice(0, 10).map((pet) => (
          <div
            key={pet.id}
            className={`petCard ${selectedPetId === pet.id ? "selected" : ""}`}
            onClick={() => handleSelect(pet.id)}
          >
            <img
              src={`images/${pet.image_ref}.png`} 
              alt={pet.species}
              className="petImage"
            />
            <p>{pet.species}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pets;