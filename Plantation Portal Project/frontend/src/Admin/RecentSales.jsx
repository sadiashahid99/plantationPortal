import { Link } from "react-router-dom";
import useFetch from "../useFetch";

const RecentSales = () => {
    const { error, isPending, data: orders } = useFetch('http://localhost:5000/order/')
    
    return ( 
    
        <div className="recent-sales box">
          <div className="title">Recent Sales</div>
          <div className="sales-details">
            <ul className="details">
                <li className="topic">Date / Time</li>
            </ul>
            <ul className="details">
                <li className="topic">Customer</li>
            </ul>
            <ul className="details">
                <li className="topic">Sales</li>
            </ul>
            <ul className="details">
                <li className="topic">Total</li>            
            </ul>
          </div>
          {orders.reverse().slice(0,10).map(order => (
            <div className="sales-details" key={order._id}>
                <ul className="details">
                    <li><a href="#">{order.dateTime}</a></li>
                </ul>
                <ul className="details">
                    <li><a href="#">{order.shippingDetails.firstName+" "+order.shippingDetails.lastName}</a></li>
                </ul>
                <ul className="details">
                    <li><a href="#">{order.orderStatus}</a></li>
                </ul>
                <ul className="details">
                    <li><a href="#">Rs. {order.totalBill}</a></li>
               
                </ul>
            </div>
          ))}
          <div className="button-area ">
            <div className="d-flex">
              <Link className="button button-block button-all" to="/admin/orders"
                >See All</Link>
            </div>
          </div>
        </div>
    
     );
}
 
export default RecentSales;