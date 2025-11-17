"use client";
import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import BlocoExpansivel from "@/app/components/bloco-expansivel/BlocoExpansivel"; 
import styles from "./page.module.css"; 
import AudioReader from "@/app/components/reader/Reader"; 

import { 
    Text, Palette, Contrast, Volume2, Code, Feather, ZoomIn, Gavel, Hand
} from "lucide-react";


const PaginaAcessibilidade: React.FC = () => {

    const recursosVisuais = [
        {
            icone: Hand,
            titulo: "VLibras para Tradução em LIBRAS",
            textoCurto: "Utilizamos o widget VLibras em todas as páginas para tradução automática de conteúdo textual para a Língua Brasileira de Sinais (LIBRAS).",
            textoExpandido: (
                <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        O VLibras é uma ferramenta governamental que promove a inclusão de usuários surdos. A tradução é feita por um avatar 3D que converte o texto lido na tela para LIBRAS.
                        Como Funciona: O usuário deve clicar no ícone do VLibras (boneco) e, em seguida, clicar no trecho de texto que deseja traduzir.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <a href="http://www.vlibras.gov.br/" target="_blank" rel="noopener noreferrer">Acessar Documentação Oficial do VLibras</a>
                    </Box>
                </>
            )
        },
        {
            icone: Volume2,
            titulo: "Audiodescrição Própria (AudioReader)",
            textoCurto: "Cada página principal possui um player de áudio exclusivo, fornecendo uma descrição do conteúdo da tela para complementar a experiência de usuários com deficiência visual.",
            textoExpandido: (
                <Typography variant="body2">
                    A Audiodescrição é essencial para descrever o texto em tela, mas também para elementos visuais (imagens, gráficos) que leitores de tela podem não capturar completamente. Embora sistemas operacionais e navegadores ofereçam leitores de tela básicos, implementamos esse recurso extra para facilitar o acesso rápido e também descrever melhor algumas coisas, sem exigir que o usuário conheça os atalhos ou recursos do sistema.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://www.ufsm.br/pro-reitorias/prograd/caed/2014/09/03/qual-a-importancia-da-audiodescricao" target="_blank" rel="noopener noreferrer">Leia sobre a importância da Audiodescrição (UFSM)</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: ZoomIn, 
            titulo: "Aumento e Redução da Fonte",
            textoCurto: "O painel de acessibilidade oferece botões diretos (A- e A+) para que o usuário ajuste o tamanho da fonte instantaneamente na tela.",
            textoExpandido: (
                <Typography variant="body2">
                    Essa funcionalidade altera o tamanho da fonte base (font-size no elemento html), permitindo que todo o texto e espaçamento (que utilizam a unidade rem) escalem proporcionalmente para melhor legibilidade. Navegadores modernos permitem o zoom ou a alteração da fonte base, mas esta funcionalidade está disponível no painel para facilitar o uso por quem não está familiarizado com as configurações do sistema.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://dev.to/lazarocontato/quando-utilizar-rem-em-ou-pixel-cf0" target="_blank" rel="noopener noreferrer">Guia: Quando utilizar rem, em ou pixel</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: Contrast,
            titulo: "Modo Alto Contraste (e Dark)",
            textoCurto: "Ajusta as cores da página para padrões rigorosos de contraste, invertendo para fundos pretos e textos claros. Crucial para baixa visão e para reduzir o brilho excessivo da tela (efeito Dark Mode).",
            textoExpandido: (
                <Typography variant="body2">
                    O Alto Contraste inverte cores de fundo e texto (priorizando preto/branco) para maximizar a separação visual dos elementos. O efeito de fundo escuro atua como um modo noturno. Isso é implementado via CSS para cumprir os requisitos da WCAG 2.1.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG) 2.1 - Padrão W3C</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: Palette,
            titulo: "Escala de Cinza (Modo Acromático)",
            textoCurto: "Remove a saturação das cores da tela, convertendo todo o conteúdo para tons de cinza. Auxilia usuários com certas formas de daltonismo ou sensibilidade à cor, além de diminuir distrações, para pessoas com TDA, por exemplo.",
            textoExpandido: (
                <Typography variant="body2">
                    A função de Escala de Cinza é aplicada através de filtros CSS (filter: grayscale(100%)) ao corpo da página. É um recurso de personalização visual focado em reduzir a distração e melhorar o conforto para usuários que processam cores de forma diferente.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://minacriativa.com.br/glossario/o-que-e-grayscale-escala-de-cinza/" target="_blank" rel="noopener noreferrer">Entenda o que é Grayscale e seus benefícios</a>
                    </Box>
                </Typography>
            )
        },
    ];

    const boasPraticas = [
        {
            icone: Gavel,
            titulo: "Contraste de Cores e Escolha da Fonte (WCAG)",
            textoCurto: "Paletas de cores rigorosamente testadas para WCAG. A fonte 'Baloo 2' foi escolhida por sua alta legibilidade e design amigável.",
            textoExpandido: (
                <Typography variant="body2">
                    A WCAG (Web Content Accessibility Guidelines) exige um contraste mínimo de 4.5:1 para texto normal. Além disso, a fonte Baloo 2 foi selecionada por sua largura de linhas e formato arredondado, o que a torna mais amigável e menos agressiva (UI/UX), facilitando a leitura por longos períodos e para usuários com dificuldades de processamento visual.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG) 2.1 - Padrão W3C</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: Code,
            titulo: "Estrutura Semântica de HTML5",
            textoCurto: "Uso correto de tags como <header>, <main>, <section> e <footer> para definir a estrutura lógica do conteúdo.",
            textoExpandido: (
                <Typography variant="body2">
                    A semântica correta é crucial para que leitores de tela naveguem e interpretem o conteúdo de forma lógica, garantindo que usuários cegos entendam a hierarquia da informação. Por exemplo, o elemento main indica o conteúdo principal e único da página.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://www.webmundi.com/desenvolvimento-de-sistemas/html/estruturacao-semantica-html5/" target="_blank" rel="noopener noreferrer">Guia de Estruturação Semântica HTML5</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: Feather,
            titulo: "Escalabilidade com Unidades REM e EM",
            textoCurto: "Todas as medidas de fonte, espaçamento e margens usam unidades relativas (rem ou em) em vez de unidades absolutas (px).",
            textoExpandido: (
                <Typography variant="body2">
                    A utilização de rem (Root Em) garante que o design inteiro se adapte ao tamanho da fonte base do usuário, um requisito essencial para a acessibilidade. Isso garante que o site seja responsivo não só em telas, mas também em tamanhos de fonte definidos pelo usuário.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://elementor.com/blog/pt-br/rem-vs-em-no-css-um-guia-completo/" target="_blank" rel="noopener noreferrer">Guia Completo: rem vs em no CSS</a>
                    </Box>
                </Typography>
            )
        },
        {
            icone: Text,
            titulo: "Atributos ALT e Descrições Detalhadas",
            textoCurto: "Todas as imagens não decorativas possuem um atributo alt bem detalhado, descrevendo o conteúdo visual para leitores de tela.",
            textoExpandido: (
                <Typography variant="body2">
                    Um alt de qualidade deve transmitir a função ou a informação da imagem. Exemplo: Em vez de alt= selo apae, usamos alt= Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero. Isso é essencial para que mecanismos de busca e leitores de tela compreendam o contexto.
                    <Box sx={{ mt: 2 }}>
                        <a href="https://userway.org/pt/blog/alt-text-em-imagens/" target="_blank" rel="noopener noreferrer">Boas práticas de Alt Text e acessibilidade</a>
                    </Box>
                </Typography>
            )
        },
    ];


    return (
        <div className={styles.pageContainer}>
            
            <Box className={styles.heroBanner} sx={{ height: "12.5rem" }}>
                 <Typography variant="h1" component="h1" className={styles.tituloAcessibilidade}>
                     Acessibilidade neste site
                 </Typography>
            </Box>
            
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <AudioReader
                    src="/audio-descricao/telaDeAcessibilidade.wav"
                    audioTitle="Resumo da Página de Acessibilidade em Áudio"
                />

                <Typography variant="h4" component="h2" align="center" className={styles.subtitulo} sx={{mt: 4}}>
                    Compromisso com a Inclusão e Experiência do Usuário
                </Typography>
                
                <Typography variant="body1" align="center" sx={{ mb: 6 }}>
                    Esta página detalha todas as funcionalidades visuais e as práticas de código adotadas para garantir que o conteúdo seja acessível a todos. Nosso objetivo é ser um modelo de inclusão digital.
                </Typography>
                
                <Divider sx={{ mb: 6 }} />

                <Typography variant="h3" component="h3" className={styles.secaoTitulo}>
                    Recursos do Site
                </Typography>
                
                <Box className={`${styles.gridBlocos} ${styles.recursosVisuais}`}> 
                    {recursosVisuais.map((recurso, index) => (
                        <BlocoExpansivel
                            key={index}
                            icone={recurso.icone}
                            titulo={recurso.titulo}
                            textoCurto={recurso.textoCurto}
                            textoExpandido={recurso.textoExpandido}
                        />
                    ))}
                </Box>
                
                <Divider sx={{ my: 6 }} />

                <Typography variant="h3" component="h3" className={styles.secaoTitulo}>
                    Boas Práticas de Programação
                </Typography>
                
                 <Box className={styles.gridBlocos}>
                    {boasPraticas.map((pratica, index) => (
                        <BlocoExpansivel
                            key={index}
                            icone={pratica.icone}
                            titulo={pratica.titulo}
                            textoCurto={pratica.textoCurto}
                            textoExpandido={pratica.textoExpandido}
                        />
                    ))}
                </Box>

            </Container>
        </div>
    );
};

export default PaginaAcessibilidade;