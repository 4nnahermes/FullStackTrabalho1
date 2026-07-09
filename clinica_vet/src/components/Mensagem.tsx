type MensagemProps = {
    tipo: "sucesso" | "erro" | "aviso";
    texto: string;
};

export default function Mensagem({ tipo, texto }: MensagemProps) {
    if (!texto) {
        return null;
    }

    let classe = "w3-panel w3-border";

    if (tipo === "sucesso") {
        classe += " w3-pale-green";
    } else if (tipo === "erro") {
        classe += " w3-pale-red";
    } else {
        classe += " w3-pale-yellow";
    }

    return (
        <div className={classe}>
            <p>{texto}</p>
        </div>
    );
}