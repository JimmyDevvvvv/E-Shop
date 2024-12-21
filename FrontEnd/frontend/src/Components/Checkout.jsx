import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import "./Checkout.css";
import { useLocation } from "react-router-dom";
const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newAddressLabel, setNewAddressLabel] = useState("");
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    let [total, setTotal] = useState(0);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchCart = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/cart`, {
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch cart items.");
          }
          const data = await response.json();
          setCartItems(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCart();
    }, []);
  
    useEffect(() => {
      const fetchAddresses = async () => {
        try {
          const response = await fetch(`/api/addresses`, {
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch addresses.");
          }
          const data = await response.json();
          setAddresses(data);
          setSelectedAddressId(data[0]?._id || "");
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchAddresses();
    }, []);
  
    const handleCheckout = async () => {
      if (!selectedAddressId) {
        alert("Please select a delivery address.");
        return;
      }
  
      if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
      }
  
      if (paymentMethod === "card") {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
          alert("Please fill in all the card details.");
          return;
        }
      }
  
      try {
        const checkoutResponse = await fetch(`/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId: selectedAddressId,
            paymentMethod,
            cardDetails: paymentMethod === "card" ? { cardName, cardNumber, expiryDate, cvv } : null,
          }),
        });
  
        if (!checkoutResponse.ok) {
          throw new Error("Checkout failed.");
        }
  
        const result = await checkoutResponse.json();
        navigate(`/confirmation/${result.orderId}`);
      } catch (err) {
        alert("An error occurred during the checkout process.");
        console.error(err.message);
      }
    };
  
    const handleAddAddress = async () => {
      if (!newAddress || !newAddressLabel) {
        alert("Please provide both address label and address.");
        return;
      }
  
      try {
        const response = await fetch(`/api/addresses`, {
          method: "POST",
          headers: { "Content-Type": "appli cation/json" },
          body: JSON.stringify({
            label: newAddressLabel,
            address: newAddress,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add address.");
        }
  
        const data = await response.json();
        setAddresses((prev) => [...prev, data]);
        setNewAddress("");
        setNewAddressLabel("");
        setShowAddAddressForm(false);
        setSelectedAddressId(data._id);
      } catch (err) {
        console.error(err.message);
      }
    };

  
  return (
    <div className="checkout-container">
      {/* Progress Bar */}
      <div className="cart-progress">
        <div className="active">
          <span>1</span>
          <p>Cart</p>
        </div>
        <div className="line"></div>
        <div className="active">
          <span>2</span>
          <p>Checkout</p>
        </div>
        <div className="line"></div>
        <div>
          <span>3</span>
          <p>Confirmation</p>
        </div>
      </div>

      <div className="checkout-content">
        {/* Delivery Address Selection */}
        <div className="cart-summary">
          <h3>Delivery Address</h3>
          {addresses.length > 0 ? (
            <div className="address-options">
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="address-dropdown"
              >
                {addresses
                  .filter((address) => address && address._id) // Filter out invalid addresses
                  .map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.label}: {address.address}
                    </option>
                  ))}
              </select>
              <button
                className="add-address-button"
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
              >
                +
              </button>
            </div>
          ) : (
            <p>No saved addresses found. Please add one from your profile page.</p>
          )}
        </div>

        {/* Add New Address Form */}
        {showAddAddressForm && (
          <div className="add-address-form">
            <input
              type="text"
              className="add-address-input"
              placeholder="Enter address label (e.g., Home, Office)"
              value={newAddressLabel}
              onChange={(e) => setNewAddressLabel(e.target.value)}
            />
            <textarea
              className="add-address-textarea"
              placeholder="Enter your address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              rows="4"
            />
            <button className="save-address-button" onClick={""}>
              Save Address
            </button>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="payment-method-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment-method"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Visa/MasterCard
            </label>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Wallet
            </label>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          {/* Visa/MasterCard Payment Fields */}
          {paymentMethod === "card" && (
            <div className="payment-details">
              <div className="row gx-3">
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Person Name</p>
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Card number</p>
                    <input
                      className="form-control mb-3"
                      type="number"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">Expiry date</p>
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Expiry Date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <p className="text mb-1">CVV</p>
                    <input
                      className="form-control mb-3"
                      type="number"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
       

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Your Order</h3>
          <ul>
            {cartItems
              .filter((item) => item && item.product && item.product._id) // Filter out invalid cart items
              .map((item) => (
                <li key={item.product._id} className="order-item">
                  <span>{item.product.name}</span>
                  <span>{(item.quantity * item.product.price).toFixed(2)} EGP</span>
                </li>
              ))}
          </ul>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              {/* <span>{subtotal.toFixed(2)} EGP</span> */}
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <strong>{total.toFixed(2)} EGP</strong>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="checkout-button" onClick={""}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;