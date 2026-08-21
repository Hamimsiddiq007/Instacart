import type { Address } from "../types"

interface AddressCardProps {
    addr: Address;
    onEditHandler: (addr: Address) => void;
    setAddress: (addresses: Address[]) => void
}
const AddressCard = ({addr, onEditHandler, setAddress } : AddressCardProps) => {

    const handleDelete = async (id: string) => {
        console.log(id)
    }
  return (
    <div>
      
    </div>
  )
}

export default AddressCard
