import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRentItems } from "../services/rentalService";
import tractorImg from "../assets/images/tractor.jpg";
import seederImg from "../assets/images/seeder.jpg";
import harvesterImg from "../assets/images/harvester.jpg";
import loaderImg from "../assets/images/loader.jpg";
import irrigatorImg from "../assets/images/irrigator.jpg";
import "./EquipmentShowcase.css";

const sliderImages = [
  { src: tractorImg, label: "Tractor" },
  { src: seederImg, label: "Seeder" },
  { src: harvesterImg, label: "Harvester" },
  { src: loaderImg, label: "Loader" },
  { src: irrigatorImg, label: "Irrigator" },
];

function EquipmentShowcase() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [equipmentList, setEquipmentList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");

  // Fetch equipment from backend
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const filters = {
          is_available: true,
        };
        if (sortBy) filters.ordering = sortBy;

        const data = await fetchRentItems(filters);
        const items = Array.isArray(data) ? data : data.results || [];

        // Map backend data to frontend format
        const mappedItems = items.map((item) => ({
          id: item.id,
          name: item.product_name,
          product_name: item.product_name,
          description: item.description,
          price: parseFloat(item.price),
          image: item.image ? `http://localhost:8000${item.image}` : tractorImg,
          is_available: item.is_available,
          quantity: item.quantity,
          rent_owner: item.rent_owner,
        }));

        setEquipmentList(mappedItems);
        setFiltered(mappedItems);
        setError(null);
      } catch (err) {
        console.error("Error loading equipment:", err);
        setError("Failed to load equipment. Please try again.");
        setEquipmentList([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [sortBy]);

  // Filter equipment by search and price
  useEffect(() => {
    let result = equipmentList.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.description.toLowerCase().includes(search.toLowerCase());

      const matchesPrice =
        (priceFilter.min === "" || eq.price >= parseFloat(priceFilter.min)) &&
        (priceFilter.max === "" || eq.price <= parseFloat(priceFilter.max));

      return matchesSearch && matchesPrice;
    });

    setFiltered(result);
  }, [search, priceFilter, equipmentList]);

  // Slider auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Slider Section */}
      <header
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          overflow: "hidden",
        }}
      >
        <div
          className="slider"
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: "transform 0.5s",
          }}
        >
          {sliderImages.map((img, idx) => (
            <div
              className="slide"
              key={idx}
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${img.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                className="slider-text"
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  color: "white",
                  fontSize: "2rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                {img.label}
              </div>
            </div>
          ))}
        </div>
        <div
          className="dot-nav"
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 10,
          }}
        >
          {sliderImages.map((_, idx) => (
            <div
              key={idx}
              className={`dot${currentSlide === idx ? " active" : ""}`}
              style={{
                width: 15,
                height: 15,
                backgroundColor:
                  currentSlide === idx ? "white" : "rgba(255,255,255,0.5)",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={() => setCurrentSlide(idx)}
            ></div>
          ))}
        </div>
      </header>

      {/* Filter Section */}
      <div
        className="filter-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          margin: "2rem",
          padding: "1.5rem",
          background: "#f9f9f9",
          borderRadius: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search equipment..."
          style={{
            width: "25%",
            minWidth: 200,
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={priceFilter.min}
          onChange={(e) =>
            setPriceFilter({ ...priceFilter, min: e.target.value })
          }
          style={{
            width: "12%",
            minWidth: 120,
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter.max}
          onChange={(e) =>
            setPriceFilter({ ...priceFilter, max: e.target.value })
          }
          style={{
            width: "12%",
            minWidth: 120,
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          <option value="">Sort by</option>
          <option value="price">Price (Low to High)</option>
          <option value="-price">Price (High to Low)</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "1rem",
            margin: "1rem 2rem",
            background: "#ffebee",
            color: "#d32f2f",
            borderRadius: 6,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#666",
          }}
        >
          Loading equipment...
        </div>
      )}

      {/* Cards Section */}
      {!loading && (
        <section
          className="cards-section"
          style={{
            padding: 40,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                fontSize: "1.1rem",
                color: "#666",
              }}
            >
              No equipment found. Try adjusting your search or price filters.
            </p>
          ) : (
            filtered.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} onNavigate={navigate} />
            ))
          )}
        </section>
      )}
    </div>
  );
}

// Equipment Card Component
function EquipmentCard({ equipment, onNavigate }) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://via.placeholder.com/300x180?text=No+Image";
  const imageUrl =
    !imageError && equipment.image ? equipment.image : fallbackImage;

  return (
    <div
      className="card"
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.15)";
      }}
    >
      <div
        style={{
          width: "100%",
          height: 180,
          background: "#f0f0f0",
          borderRadius: 10,
          marginBottom: 10,
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt={equipment.name}
          onError={() => setImageError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: "0 10px" }}>
        <h3
          style={{
            marginTop: 10,
            fontSize: "1.4rem",
            color: "#333",
            marginBottom: 8,
          }}
        >
          {equipment.name}
        </h3>

        {equipment.rent_owner && (
          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 8 }}>
            by <strong>{equipment.rent_owner.name}</strong>
          </p>
        )}

        <p
          style={{
            fontSize: 14,
            color: "#555",
            marginBottom: 10,
            minHeight: 40,
          }}
        >
          {equipment.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div
            className="price"
            style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#27ae60" }}
          >
            ৳{equipment.price}/day
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: equipment.is_available ? "#4caf50" : "#d32f2f",
            }}
          >
            {equipment.is_available ? "✓ Available" : "✗ Not Available"}
          </div>
        </div>

        <button
          className="btn-details"
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: equipment.is_available ? "#4caf50" : "#ccc",
            color: "white",
            borderRadius: 6,
            cursor: equipment.is_available ? "pointer" : "not-allowed",
            border: "none",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onClick={() =>
            equipment.is_available && onNavigate(`/equipment/${equipment.id}`)
          }
          disabled={!equipment.is_available}
          onMouseEnter={(e) => {
            if (equipment.is_available)
              e.target.style.backgroundColor = "#45a049";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4caf50";
          }}
        >
          {equipment.is_available ? "Rent Now" : "Not Available"}
        </button>
      </div>
    </div>
  );
}

export default EquipmentShowcase;
