import { useEffect, useState } from "react";
import type { Address } from "../types";
import { dummyAddressData } from "../assets/assets";

const Address = () => {

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editigId, setEditingId] = useState<string | null>(null);
  const [form, setform] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false
  });

  const resetForm = () => {
    setform({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false
    });
    setEditingId(null);
    setShowForm(false);
  }

  const handleSubmit = async (e : React.SubmitEvent) => {
    e.preventDefault();
  }

  const onEditHandler = (add: Address) => {
    setform({
      label: add.label,
      address: add.address,
      city: add.city,
      state: add.state,
      zip: add.zip,
      isDefault: add.isDefault
    });
    setEditingId(add._id);
    setShowForm(true);
  }

  useEffect(() => {
    setAddresses(dummyAddressData)
    setLoading(false);
  }, []);

  return (
    <div>
      Address
    </div>
  )
}

export default Address
