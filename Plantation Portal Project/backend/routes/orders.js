const router = require("express").Router();
const _ = require("lodash");
const { Order } = require("../models/orders.model");

router.route("/").get((req, res) => {
  Order.aggregate(
    [
      {
        $lookup: {
          from: "users", // collection to join - Should have same name as collection mongoDB
          localField: "userId", //field from the input documents
          foreignField: "_id", //field from the documents of the "from" collection
          as: "userInfo", // output array field
        },
      },
      {
        $project: {
          //field we don't want to include in result
          "userInfo.password": 0,
        },
      },
    ])
    .sort({ dateTime: -1 })
    .then((result) => {
      res.status(200).json(result);
    });
  // Order.find()
  //   .then(Order => res.json(Order))
  //   .catch(err => res.status(400).json('Error: ' + err));
});

const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function getCurrentDateTime() {
  const d = new Date();
  let h = d.getHours();
  let x = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  let m = d.getMinutes();
  m = m < 10 ? "0" + m : m;
  let date =
    month[d.getMonth()] + " " + d.getDate() + ", " + h + ":" + m + " " + x;
  return date;
}

router.post("/newOrder", async (req, res) => {
  try {
    console.log("Order data at server:");
    console.log(req.body);

    const userId = req.body[0]._id;
    let dateOfOrder = getCurrentDateTime();
    const totalBill = req.body[1]; //total bill
    const productsArr = req.body[2]; //all cart products
    const shippingDetails = req.body[3];
    const paymentMethod = req.body[4];
    const billingAddress = req.body[5];
    const services = req.body[6];

    const neworder = {
      userId: userId,
      orderStatus: "pending",
      dateTime: dateOfOrder,
      totalBill: totalBill,
      paymentMethod: paymentMethod,
      billingAddress: billingAddress,
      productsDetail: productsArr,
      servicesDetails: services,
      shippingDetails: shippingDetails,
    };

    let placeOrder = new Order(neworder);
    const order = await placeOrder.save();
    console.log("New order is: ", order);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getCustomerOrders/:id", async (req, res) => {
  try {
    const custId = req.params.id;

    const customerOrders = await Order.find({
      userId: custId,
    });

    res.status(200).json(customerOrders);
  } catch (err) {
    console.log(err);
  }
});

module.exports.orderRouter = router;
