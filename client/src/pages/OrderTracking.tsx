import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { Order } from "../types";
import { dummyDashboardOrdersData } from "../assets/assets";
import Loading from "../components/Loading";

const OrderTracking = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    setOrder(dummyDashboardOrdersData.find(order => order._id === id) as any);
    setLoading(false);
  }, [id, navigate])

  if(loading) return <Loading/>
  if(!order) null;

  return (
    <div>
      Order Tracking
    </div>
  )
}

export default OrderTracking
