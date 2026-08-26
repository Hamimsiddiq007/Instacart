import { XIcon } from "lucide-react"

const AddressForm = ({resetForm, handleSubmit, form, setForm, editingId} : any) => {
  return (
    <>
    {/* Overley */}
    <div onClick={resetForm} className="fixed inset-0 bg-black/40 z-50" />

    {/* Form container */}
    <div className="fixed inset-0 z-50 flex-center p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-app-green">{editingId ? "Edit Address" : "Add New Address"}</h2>
                <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-app-cream">
                    <XIcon className="size-5" />
                </button>
            </div>
            
        </form>
    </div>
      
    </>
  )
}

export default AddressForm
