import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Purchase {
  id: number;
  quantity: number;
  purchase_date: string;
  unit_name: string;
  days_to_expire: number;
}

interface PurchaseHistoryModalProps {
  ingredientId: number;
  ingredientName: string;
  onClose: () => void;
}

const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
                                                                     ingredientId,
                                                                     ingredientName,
                                                                     onClose,
                                                                   }) => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Token not found.");
        setLoading(false);
        return;
      }

      try {
        const userId = jwtDecode<{ id: number }>(token).id;

        const response = await axios.get(
            `http://localhost:8080/api/user-ingredients/${userId}/history/${ingredientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setPurchaseHistory(response.data);
      } catch (err) {
        setError("Error loading purchase history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [ingredientId]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setPurchaseHistory((prev) =>
        prev.map((purchase) =>
            purchase.id === id ? { ...purchase, quantity: newQuantity } : purchase
        )
    );
  };

  const saveChanges = async (id: number, newQuantity: number) => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Token not found.");
      setLoading(false);
      return;
    }

    try {
      const userId = jwtDecode<{ id: number }>(token).id;
      console.log(
          `http://localhost:8080/api/user-ingredients/${userId}/history/${id}`,
          newQuantity,
          `Bearer ${token}`
      );
      await axios.put(
          `http://localhost:8080/api/user-ingredients/${userId}/history/${id}`,
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPurchaseHistory((prev) =>
          prev.map((purchase) =>
              purchase.id === id ? { ...purchase, quantity: newQuantity } : purchase
          )
      );
    } catch (err) {
      setError("Error saving changes.");
    } finally {
      setLoading(false);
    }
  };

  const isPurchaseExpired = (
      purchaseDate: string,
      daysToExpire: number
  ): boolean => {
    console.log(purchaseDate, daysToExpire);
    if (!purchaseDate || !daysToExpire) {
      return false; // if no data, consider not expired
    }

    const purchaseDateObj = new Date(purchaseDate);
    const today = new Date();

    const expirationDate = new Date(purchaseDateObj);
    expirationDate.setDate(purchaseDateObj.getDate() + daysToExpire);

    return today >= expirationDate; // if today is after expiration date
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">
            Purchase History: {ingredientName}
          </h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && purchaseHistory.length === 0 && (
              <p>No purchase history available.</p>
          )}
          {!loading && !error && purchaseHistory.length > 0 && (
              <ul className="space-y-2">
                {purchaseHistory.map((purchase) => {
                  const expired = isPurchaseExpired(
                      purchase.purchase_date,
                      purchase.days_to_expire
                  );
                  return (
                      <li
                          key={purchase.id}
                          className={`flex justify-between items-center p-2 rounded ${
                              expired ? "bg-red-100" : "bg-gray-100"
                          }`}
                      >
                  <span>
                    {new Date(purchase.purchase_date).toLocaleDateString()}
                  </span>
                        <input
                            type="number"
                            className="w-16 text-center border rounded"
                            value={purchase.quantity}
                            onChange={(e) =>
                                handleQuantityChange(purchase.id, +e.target.value)
                            }
                            onBlur={(e) =>
                                saveChanges(purchase.id, +e.target.value)
                            }
                        />
                        <span>{purchase.unit_name}</span>
                      </li>
                  );
                })}
              </ul>
          )}
          <button
              onClick={onClose}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Close
          </button>
        </div>
      </div>
  );
};

export default PurchaseHistoryModal;
