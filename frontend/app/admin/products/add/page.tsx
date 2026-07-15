import ProductForm from "../_components/ProductForm";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div className="max-w-7xl mx-auto px-8 lg:px-10 py-8 font-sans">
                <ProductForm />
            </div>
        </div>
    );
}
