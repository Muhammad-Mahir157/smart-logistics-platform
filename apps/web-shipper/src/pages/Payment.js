import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  background-color: #df8100;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #e4a11b;
  }
`;

const TopTexts = styled.div``;
// const TopText = styled.span`
//   text-decoration: underline;
//   cursor: pointer;
//   margin: 0px 10px;
// `;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  flex: 3;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  /* height: 80vh; */
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #df8100;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background-color: #e4a11b;
  }
`;

const Payment = () => {
  //   const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const [shipment, setShipment] = useState(null);
  const [selected, setSelected] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.token;
  const headers = { token: `Bearer ${TOKEN}` };

  const handleCardClick = (index, obj) => {
    setSelectedCard(index);
    const price = parseInt(obj.price);
    setSelected({ ...obj, price: price });
  };

  const onToken = (token) => {
    setStripeToken(token);
  };

  console.log(stripeToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/requestshipment/get/payment_pending",
          {
            headers,
          }
        );
        // console.log("Pending Shipments", res.data);

        setShipment(res.data);
      } catch (err) {
        console.error("Error fetching completed shipemnts");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post(
          "/checkout/payment",
          {
            tokenId: stripeToken.id,
            amount: selected.price,
            isShared: selected.shared,
            shipmentId: selected._id,
          },
          { headers }
        );
        console.log(res.data);

        //   dispatch(clearCart());
        //   navigate("/success", {
        //     state: {
        //       stripeData: res.data,
        //       products: cart,
        //     },
        //   });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
    stripeToken && makeRequest();
  }, [stripeToken]);

  // const sampleData =

  return (
    <Container>
      {/* <Navbar />
      <Announcement /> */}
      <Navbar />
      <Wrapper>
        <Title>YOUR SHIPMENTS</Title>
        <Top>
          <TopTexts></TopTexts>
          <TopButton>CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {shipment &&
              shipment.map((object, index) => (
                <Card
                  className={`m-2 ${
                    selectedCard === index
                      ? 'border border-warning border-5"'
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleCardClick(index, object)}
                >
                  <Card.Body>
                    <Card.Title>Name: {object.name}</Card.Title>
                    <Card.Text>
                      Vehicle Category: {object.vehicleCategory}
                    </Card.Text>
                    <Card.Text>
                      Shared: {object.shared ? "true" : "false"}
                    </Card.Text>
                    <Card.Text>Price: {object.price} RS</Card.Text>
                    <Card.Text>
                      <strong>Load:</strong>
                    </Card.Text>
                    {object.Load.map((load, loadIndex) => (
                      <ListGroup
                        horizontal
                        className="m-2 mb-3"
                        key={loadIndex}
                      >
                        <ListGroup.Item>Length: {load.length}</ListGroup.Item>
                        <ListGroup.Item>Width: {load.width}</ListGroup.Item>
                        <ListGroup.Item>Height: {load.height}</ListGroup.Item>
                        <ListGroup.Item>
                          Quantity: {load.quantity}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Category: {load.category}
                        </ListGroup.Item>
                      </ListGroup>
                    ))}
                  </Card.Body>
                  <Card.Footer>
                    {/* <Button
                      className="mb-2 mt-3 button-global"
                      size=""
                      variant="primary"
                      //   onClick={() => cancelPending(object._id)}
                    >
                      Select
                    </Button> */}
                  </Card.Footer>
                </Card>
              ))}
          </Info>
          <Summary>
            <SummaryTitle>SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              {/* <SummaryItemPrice>RS {cart.total}</SummaryItemPrice> */}
              <SummaryItemPrice>RS {selected.price}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Volume (meter cube)</SummaryItemText>
              <SummaryItemPrice>{selected.totalVolume}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>RS 0</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>RS {selected.price}</SummaryItemPrice>
              {/* <SummaryItemPrice>RS 5.90</SummaryItemPrice> */}
            </SummaryItem>
            <StripeCheckout
              name="Smart Logistics"
              // image="https://avatars.githubusercontent.com/u/1486366?v=4"
              billingAddress
              shippingAddress
              description={`Your total is RS ${selected.price}`}
              amount={selected.price * 100}
              token={onToken}
              currency="PKR"
              stripeKey={KEY}
            >
              <Button>CHECKOUT NOW</Button>
            </StripeCheckout>
          </Summary>
        </Bottom>
      </Wrapper>
      {/* <Footer /> */}
    </Container>
  );
};

export default Payment;
