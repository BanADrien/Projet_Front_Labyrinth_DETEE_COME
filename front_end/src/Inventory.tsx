import React from "react";

interface InventoryProps {
  inventory: { [key: string]: number };
}

const ITEM_ICONS: { [key: string]: string } = {
  key_red: "🔴",
  key_blue: "🔵",
  pickaxe: "⛏️",
  water_bucket: "🪣",
  swim_boots: "🥾",
};

const ITEM_NAMES: { [key: string]: string } = {
  key_red: "Clé rouge",
  key_blue: "Clé bleue",
  pickaxe: "Pioche",
  water_bucket: "Seau d'eau",
  swim_boots: "Bottes",
};

const Inventory: React.FC<InventoryProps> = ({ inventory }) => {
  const items = Object.entries(inventory).filter(([_, count]) => count > 0);

  return (
    <div className="inventory-container">
      <h3 className="inventory-title">⚔️ Inventaire</h3>
      <div className="inventory-grid">
        {items.length === 0 ? (
          <p className="inventory-empty">Vide</p>
        ) : (
          items.map(([itemId, count]) => (
            <div key={itemId} className="inventory-item">
              <span className="item-icon">{ITEM_ICONS[itemId] || "💎"}</span>
              <div className="item-info">
                <p className="item-name">{ITEM_NAMES[itemId] || itemId}</p>
                {count > 1 && <span className="item-count">×{count}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
