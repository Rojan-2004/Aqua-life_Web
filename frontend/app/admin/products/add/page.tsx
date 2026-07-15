import ProductForm from "../_components/ProductForm";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div className="mx-auto max-w-3xl px-8 lg:px-10 py-10 font-sans">
                <ProductForm />
            </div>
        </div>
    );
}
