"use client"

import styles from "./page.module.css";

type Sistema = {
    nome: string;
    descricao: string;
    url?: string;
}

const sistemas: Sistema[] = [
    {
        nome: "APAE",
        descricao: "Sistema utilizado para gerenciar o cadastro de pacientes, profissionais e agendamento de atendimentos na APAE de Esperança. Ele permite que a diretoria registre informações importantes sobre os pacientes, como dados pessoais, histórico médico e necessidades específicas.",
        url: ""

    },
    {
        nome: "Gestão escolar",
        descricao: "Sistema utilizado para gerenciar as turmas, controle de frequência e avaliação de alunos na APAE de Esperança. Ele permite que os professores registre informações importantes sobre os alunos, como dados pessoais, histórico escolar e necessidades específicas.",
        url: ""
    },
    {
        nome: "Atendimento",
        descricao: "Sistema utilizado para gerenciar os atendimentos dos pacientes na APAE de Esperança. Ele permite que a equipe de atendimento registre informações importantes sobre os atendimentos, como dados pessoais, histórico médico e necessidades específicas.",
        url: ""
    }
];

export default function AcessoSistemas() {
    const handleClick = (url?: string) => {
        if (!url) {
            alert("Sistema ainda não disponível!");
            return;
        }
        window.open(url, "_blank");
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.titulo}>
                Acesso aos Sistemas
            </h1>
            <div className={styles.sistemasContainer}>
                {sistemas.map((sistema, index) => (
                    <div key={index} className={styles.sistemaCard} onClick={() => handleClick(sistema.url)}>
                        <h3>{sistema.nome}</h3>
                        <p>{sistema.descricao}</p>

                        {!sistema.url && (
                            <span className={styles.sistemaIndisponivel}>Indisponível</span>
                        )}
                    </div>
                ))}
            </div> 
        </div>
    );

}