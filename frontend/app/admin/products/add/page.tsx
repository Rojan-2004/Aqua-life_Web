import ProductForm from "../_components/ProductForm";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px", boxSizing: "border-box" }}>
                <ProductForm />
            </div>
        </div>
    );
}
