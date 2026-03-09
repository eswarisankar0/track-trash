import { useEffect, useState } from "react";
import api from "../services/api";
import "./Collections.css";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    fetchCollections();
    // Check user role from localStorage or auth context
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  const fetchCollections = async () => {
    try {
      let res;
      const role = localStorage.getItem("userRole") || "admin";
      
      if (role === "collector") {
        res = await api.get("/collections/my");
      } else {
        res = await api.get("/collections");
      }
      
      setCollections(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load collections");
      setLoading(false);
      console.error(err);
    }
  };

  const completeCollection = async (id) => {
    try {
      await api.put(`/collections/complete/${id}`);
      setCollections(collections.map(c => 
        c.id === id ? { ...c, status: "completed" } : c
      ));
    } catch (err) {
      console.error("Failed to complete collection", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      default:
        return "❓";
    }
  };

  if (loading) return <div className="collections-container"><p>Loading collections...</p></div>;
  if (error) return <div className="collections-container"><p className="error">{error}</p></div>;

  return (
    <div className="collections-container">
      <div className="page-header">
        <h1>🚚 Collections</h1>
        <p>Track and manage waste collection assignments</p>
      </div>

      {collections.length === 0 ? (
        <div className="empty-state">
          <p>📭 No collections at the moment</p>
        </div>
      ) : (
        <div className="collections-list">
          {collections.map((collection) => (
            <div key={collection.id} className={`collection-item ${collection.status?.toLowerCase() || 'pending'}`}>
              <div className="collection-header">
                <span className="collection-icon">{getStatusIcon(collection.status)}</span>
                <div className="collection-info">
                  <h3>Collection #{collection.id}</h3>
                  <p className="collection-details">
                    Bin #{collection.binId} • Collector: {collection.collectorName || "Unassigned"}
                  </p>
                </div>
                <span className="collection-status">{collection.status || "Pending"}</span>
              </div>

              <div className="collection-body">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Scheduled Date</span>
                    <span className="info-value">
                      {collection.scheduledDate ? new Date(collection.scheduledDate).toLocaleDateString() : "Not set"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{collection.location || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Weight Collected</span>
                    <span className="info-value">{collection.weightCollected || "0"} kg</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Route</span>
                    <span className="info-value">{collection.route || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="collection-footer">
                {userRole === "collector" && collection.status?.toLowerCase() === "pending" && (
                  <button
                    className="btn-small btn-primary"
                    onClick={() => completeCollection(collection.id)}
                  >
                    Complete Collection
                  </button>
                )}
                {userRole === "admin" && (
                  <>
                    <button className="btn-small btn-secondary">Edit</button>
                    {collection.status?.toLowerCase() !== "completed" && (
                      <button className="btn-small btn-primary">Reassign</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;
