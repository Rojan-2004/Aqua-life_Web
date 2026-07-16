import ProductForm from "../_components/ProductForm";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 font-sans">
                <ProductForm />
            </div>
        </div>
    );
}
