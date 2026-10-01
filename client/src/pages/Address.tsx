import { useEffect, useState } from "react";
import type { Address } from "../types";
import { dummyAddressData } from "../assets/assets";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/authContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Address = () => {

  const {updateUser} = useAuth()

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
    isDefault: false,
  });

  const resetForm = () => {
    setform({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLocation = (retries = 3): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          }, (error: any) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000); // Retry after 1 second
            }else{
              reject(new Error(error.message || "Unable to retrieve location"));
            }
          },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      })
    }
    attempt();
  })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const coords = await getLocation();
      const payload = {...form, ...coords}

      if(editigId){
        const {data} = await api.put(`/address/${editigId}`, payload);
        setAddresses(data.addresses);
        updateUser({addresses: data.addresses});
        toast.success("Address updated successfully")
      } else{
        const {data} = await api.post(`/address`, payload);
        setAddresses(data.addresses);
        updateUser({addresses: data.addresses});
        toast.success("Address added successfully")
      }
      resetForm();
    } catch (error: any) {
      toast.error( error.response?.data?.message || error.message);
    }
  };

  const onEditHandler = (add: Address) => {
    setform({
      label: add.label,
      address: add.address,
      city: add.city,
      state: add.state,
      zip: add.zip,
      isDefault: add.isDefault,
    });
    setEditingId(add.id);
    setShowForm(true);
  };

  useEffect(() => {
    setAddresses(dummyAddressData);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-app-green">
            My Addresses
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
          >
            <PlusIcon className="size-4" /> Add Address
          </button>
        </div>
        {/* Form model */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setform}
            editingId={editigId}
          />
        )}

        {/* Address list */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPinIcon className="size-12 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">
              No addresses found
            </h2>
            <p className="text-sm text-app-text-l">
              Add an address for faster checkout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((add) => (
              <AddressCard
                key={add.id}
                addr={add}
                onEditHandler={onEditHandler}
                setAddress={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
