import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Purchase {
  id: number;
  quantity: number;
  purchase_date: string;
  unit_name: string;
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
        setError("Токен не найден.");
        setLoading(false);
        return;
      }

      try {
        const userId = jwtDecode<{ id: number }>(token).id;

        const response = await axios.get(
          `http://localhost:8080/api/user-ingredients/${userId}/history/${ingredientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPurchaseHistory(response.data);
      } catch (err) {
        setError("Ошибка при загрузке истории покупок.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [ingredientId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          Історія покупок: {ingredientName}
        </h2>
        {loading && <p>Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && purchaseHistory.length === 0 && (
          <p>Історія покупок відсутня.</p>
        )}
        {!loading && !error && purchaseHistory.length > 0 && (
          <ul className="space-y-2">
            {purchaseHistory.map((purchase) => (
              <li
                key={purchase.id}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {new Date(purchase.purchase_date).toLocaleDateString()}
                </span>
                <span>
                  {purchase.quantity} {purchase.unit_name}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;
