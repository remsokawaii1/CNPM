import "./BillHeader.css";
import BillItem from "./BillItem";

export default function BillHeader(props) {
  const { datetime, tableId, paymentId, products, totalCost } = props;

  return (
    <div className="bill-header">
      <div className="bill-list">
        <div className="attribute">
          <span style={{ textAlign: "left" }}>Food Names</span>
          <span style={{ textAlign: "center" }}>Quantities</span>
          <span style={{ textAlign: "right" }}>Price</span>
        </div>
        <div>
          <hr style={{ color: "#ffff1a", borderColor: "#ffff1a" }} />
        </div>
        {props.products.map((product) => (
          <BillItem
            key={product.Name}
            name={product.Name}
            quantity={product.Quantity}
            price={(product.PricePerUnit * product.Quantity).toFixed(2) * 1 }
          />
        ))}
        <div>
          <hr style={{ borderColor: "#ffff1a" }} />
        </div>
        <div className="total">
          <span style={{ textAlign: "left" }}>Total</span>
          <span style={{ textAlign: "right" }}>{props.totalCost}$</span>
        </div>
      </div>
    </div>
  );
}
