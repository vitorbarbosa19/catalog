import React, { useMemo } from "react";
import { useHeader, useFooter, useHistory } from "@bit/vitorbarbosa19.ziro.flow-manager";
import Header from "@bit/vitorbarbosa19.ziro.header";
import { containerWithPadding } from "@ziro/theme";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { supportPhoneNumber } from "../utils";

import { cnaesContainer } from "./styles";

const SupportedCnaes = () => {
    const history = useHistory();
    const backPath = useMemo(() => (history[history.length - 2] ? history[history.length - 2].pathname : "/login"), [history].pathname);

    useHeader(null);
    useFooter(null);
    return (
        <div style={containerWithPadding}>
            <Header type="icon-link" title="CNAEs Válidos" icon="back" navigateTo={backPath} />

            <div style={{ marginTop: "-15px", marginBottom: "10px" }}>
                <p>Verifique na lista abaixo se o seu CNAE é válido. Qualquer dúvida fale com nosso suporte.</p>
            </div>

            <Button
                type="button"
                cta="Falar com suporte"
                click={() => window.open(`https://api.whatsapp.com/send?phone=${supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />

            <div style={{ width: "100%", display: "grid", justifyItems: "center" }}>
                <div style={cnaesContainer}>
                    <p>
                        <strong>1091-1/02 -</strong> Fabricação de produtos de padaria e confeitaria com predominância de produção própria
                    </p>
                    <p>
                        <strong>1412-6/01 -</strong> Confecção de peças de vestuário, exceto roupas íntimas e as confeccionadas sob medida.
                    </p>
                    <p>
                        <strong>1412-6/02 -</strong> Confecção, sob medida, de peças do vestuário, exceto roupas íntimas
                    </p>
                    <p>
                        <strong>1412-6/03 -</strong> Facção de peças do vestuário, exceto roupas íntimas.
                    </p>
                    <p>
                        <strong>1413-4/03 -</strong> Facção de roupas profissionais
                    </p>
                    <p>
                        <strong>1531-9/01 -</strong> Fabricação de calçados de couro
                    </p>
                    <p>
                        <strong>2062-2/00 -</strong> Fabricação de produtos de limpeza e polimento
                    </p>
                    <p>
                        <strong>2652-3/00 -</strong> Fabricação de cronômetros e relógios
                    </p>
                    <p>
                        <strong>4616-8/00 -</strong> Representantes comerciais e agentes do comércio de têxteis, vestuário, calçados e artigos de
                        viagem
                    </p>
                    <p>
                        <strong>4642-7/01 -</strong> Comércio atacadista de artigos do vestuário e acessórios, exceto profissionais e de segurança
                    </p>
                    <p>
                        <strong>4649-4/10 -</strong> Comércio atacadista de jóias, relógios e bijuterias, inclusive pedras preciosas e semipreciosas
                        lapidadas
                    </p>
                    <p>
                        <strong>4649-4/99 -</strong> Comércio atacadista de outros equipamentos e artigos de uso pessoal e doméstico não especificados
                        anteriormente
                    </p>
                    <p>
                        <strong>4712-1/00 -</strong> Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios -
                        minimercados, mercearias e armazéns
                    </p>
                    <p>
                        <strong>4721-1/02 -</strong> Padaria e confeitaria com predominância de revenda
                    </p>
                    <p>
                        <strong>4759-8/99 -</strong> Comércio varejista de outros artigos de uso pessoal e doméstico não especificados anteriormente.
                    </p>
                    <p>
                        <strong>4763-6/01 -</strong> Comércio varejista de brinquedos e artigos recreativos
                    </p>
                    <p>
                        <strong>4763-6/02 -</strong> Comércio varejista de artigos esportivos
                    </p>
                    <p>
                        <strong>4763-6/03 -</strong> Comércio varejista de bicicletas e triciclos; peças e acessórios
                    </p>
                    <p>
                        <strong>4763-6/04 -</strong> Comércio varejista de artigos de caça, pesca e camping
                    </p>
                    <p>
                        <strong>4763-6/05 -</strong> Comércio varejista de embarcações e outros veículos recreativos; peças e acessórios
                    </p>
                    <p>
                        <strong>4781-4/00 -</strong> Comércio varejista de artigos do vestuário e acessórios.
                    </p>
                    <p>
                        <strong>4783-1/01 -</strong> Comércio varejista de artigos de joalheria
                    </p>
                    <p>
                        <strong>4783-1/02 -</strong> Comércio varejista de artigos de relojoaria
                    </p>
                    <p>
                        <strong>4789-0/01 -</strong> Comércio varejista de suvenires, bijuterias e artesanatos
                    </p>
                    <p>
                        <strong>4789-0/99 -</strong> Comércio varejista de outros produtos não especificados anteriormente
                    </p>
                    <p>
                        <strong>6611-8/03 -</strong> Bolsa de mercadorias e futuros
                    </p>
                    <p>
                        <strong>7410-2/03 -</strong> Design de produto
                    </p>
                    <p>
                        <strong>7490-1/99 -</strong> Outras atividades profissionais, científicas e técnicas não especificadas anteriormente
                    </p>
                    <p>
                        <strong>7723-3/00 -</strong> Aluguel de objetos do vestuário, jóias e acessórios.
                    </p>
                    <p>
                        <strong>8599-6/99 -</strong> Outras atividades de ensino não especificadas anteriormente.
                    </p>
                    <p>
                        <strong>9602-5/01 -</strong> Cabeleireiros, manicure e pedicure.
                    </p>
                    <p>
                        <strong>9602-5/02 -</strong> Atividades de estética e outros serviços de cuidados com a beleza
                    </p>
                    <p>
                        <strong>47.55-5-02 -</strong> Comercio Varejista de Artigos de Armarinho
                    </p>
                </div>
            </div>

            <Button
                type="button"
                cta="Falar com suporte"
                click={() => window.open(`https://api.whatsapp.com/send?phone=${supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />
        </div>
    );
};

export default SupportedCnaes;
