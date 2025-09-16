

// --- Assistant-injected helpers (safe, non-destructive) ---
if (typeof window !== 'undefined') (function(){
  // DOM helpers
  window.setText = window.setText || function(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  window.shuffleArray = window.shuffleArray || function(array) {
    const arr = array.slice();
    let m = arr.length;
    const randomInt = (max) => {
      if (window.crypto && crypto.getRandomValues) {
        const rand = new Uint32Array(1);
        crypto.getRandomValues(rand);
        return rand[0] % max;
      }
      return Math.floor(Math.random() * max);
    };
    while (m) {
      const i = randomInt(m--);
      const t = arr[m]; arr[m] = arr[i]; arr[i] = t;
    }
    return arr;
  };
  // Provide optimized generateAnswerOptions copy as fallback if original fails later
  window.generateAnswerOptionsOptimized = window.generateAnswerOptionsOptimized || function(correctCountry, poolByContinent, totalOptions = 4) {
    const options = new Set([correctCountry]);
    const continents = Object.keys(poolByContinent || {});
    const same = (poolByContinent && poolByContinent[correctCountry.continent]) || [];
    const shuffledSame = window.shuffleArray(same || []);
    for (let i=0; i<shuffledSame.length && options.size < totalOptions; i++) {
      const c = shuffledSame[i];
      if (c.country !== correctCountry.country) options.add(c);
    }
    const allCountries = window.shuffleArray(continents.flatMap(c => (poolByContinent[c]||[])));
    let attempts = 0;
    for (let i=0; i<allCountries.length && options.size < totalOptions && attempts < 500; i++, attempts++) {
      const candidate = allCountries[i];
      if (!candidate) continue;
      if (candidate.country === correctCountry.country) continue;
      options.add(candidate);
    }
    const optsArray = Array.from(options).slice(0, totalOptions);
    return window.shuffleArray(optsArray);
  };
  // Setup image fallback and aria-live when DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    const flagImg = document.getElementById('flag-img');
    if (flagImg && !flagImg._assistantFallbackHooked) {
      flagImg._assistantFallbackHooked = true;
      flagImg.addEventListener('error', function() {
        try {
          flagImg.src = 'imagens_paises/fallback.svg';
          flagImg.alt = 'Bandeira indisponível';
        } catch(e){}
      });
    }
    if (!document.getElementById('aria-live')) {
      const d = document.createElement('div');
      d.id = 'aria-live';
      d.setAttribute('aria-live','polite');
      d.style = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(d);
    }
  });
})();
 // --- end assistant injection ---

// Dados do quiz com diferentes níveis de dificuldade - VERSÃO COM OPÇÕES DINÂMICAS
const quizData = {
    easy: [
        {
            country: "Brasil",
            image: "imagens_paises/brasil.svg",
            hint: "O maior país da América do Sul, famoso pelo futebol e pelo Carnaval.",
            continent: "América do Sul"
        },
        {
            country: "Estados Unidos",
            image: "imagens_paises/estados_unidos.svg",
            hint: "País com 50 estados, conhecido por Hollywood e a Estátua da Liberdade.",
            continent: "América do Norte"
        },
        {
            country: "França",
            image: "imagens_paises/france.svg",
            hint: "País europeu famoso pela Torre Eiffel e pela culinária refinada.",
            continent: "Europa"
        },
        {
            country: "Japão",
            image: "imagens_paises/japan.svg",
            hint: "País insular asiático conhecido pela tecnologia e cultura pop.",
            continent: "Ásia"
        },
        {
            country: "Reino Unido",
            image: "imagens_paises/reino_unido.svg",
            hint: "Reino formado por Inglaterra, Escócia, País de Gales e Irlanda do Norte.",
            continent: "Europa"
        },
        {
            country: "Alemanha",
            image: "imagens_paises/alemanha.svg",
            hint: "Maior economia da Europa, conhecida pela engenharia e cerveja.",
            continent: "Europa"
        },
        {
            country: "China",
            image: "imagens_paises/china.svg",
            hint: "País mais populoso do mundo, berço da Grande Muralha.",
            continent: "Ásia"
        },
        {
            country: "Canadá",
            image: "imagens_paises/canada.svg",
            hint: "Segundo maior país do mundo em território, famoso pelo xarope de bordo.",
            continent: "América do Norte"
        },
        {
            country: "Austrália",
            image: "imagens_paises/australia.svg",
            hint: "Continente-país conhecido pelos cangurus e pela Grande Barreira de Coral.",
            continent: "Oceania"
        },
        {
            country: "Argentina",
            image: "imagens_paises/argentina.svg",
            hint: "Segundo maior país da América do Sul, famoso pelo tango e pelo futebol.",
            continent: "América do Sul"
        },
        {
            country: "Itália",
            image: "imagens_paises/italy.svg",
            hint: "País em forma de bota, berço do Império Romano e da pizza.",
            continent: "Europa"
        },
        {
            country: "Rússia",
            image: "imagens_paises/russia.svg",
            hint: "Maior país do mundo em território, se estende da Europa à Ásia.",
            continent: "Europa"
        },
        {
            country: "Índia",
            image: "imagens_paises/india.svg",
            hint: "Segundo país mais populoso do mundo, famoso pelo Taj Mahal.",
            continent: "Ásia"
        },
        {
            country: "México",
            image: "imagens_paises/mexico.svg",
            hint: "País norte-americano famoso pelos astecas, maias e pela tequila.",
            continent: "América do Norte"
        },
        {
            country: "Espanha",
            image: "imagens_paises/spain.svg",
            hint: "País ibérico que colonizou grande parte da América Latina.",
            continent: "Europa"
        },
        // MODIFICAÇÃO: Adicionando mais países ao pool do modo Fácil para totalizar 20 bandeiras.
        {
            country: "Portugal",
            image: "imagens_paises/portugal.svg",
            hint: "País ibérico que colonizou o Brasil.",
            continent: "Europa"
        },
        {
            country: "Grécia",
            image: "imagens_paises/grecia.svg",
            hint: "Berço da democracia e da filosofia ocidental.",
            continent: "Europa"
        },
        {
            country: "Irlanda",
            image: "imagens_paises/ireland.svg",
            hint: "Ilha esmeralda famosa pelos trevos e pelo Dia de São Patrício.",
            continent: "Europa"
        },
        {
            country: "Suíça",
            image: "imagens_paises/switzerland.svg",
            hint: "País alpino neutro, conhecido pelos relógios e chocolate.",
            continent: "Europa"
        },
        {
            country: "Suécia",
            image: "imagens_paises/sweden.svg",
            hint: "País nórdico conhecido pela IKEA e pelos prêmios Nobel.",
            continent: "Europa"
        },
        {
            country: "Noruega",
            image: "imagens_paises/norway.svg",
            hint: "País nórdico famoso pelos fiordes e pelo petróleo.",
            continent: "Europa"
        },
        {
            country: "Dinamarca",
            image: "imagens_paises/denmark.svg",
            hint: "País escandinavo conhecido pelos contos de fadas de Andersen.",
            continent: "Europa"
        },
        {
            country: "Polônia",
            image: "imagens_paises/poland.svg",
            hint: "País da Europa Central, berço de Copérnico e Marie Curie.",
            continent: "Europa"
        },
        {
            country: "África do Sul",
            image: "imagens_paises/africa_do_sul.svg",
            hint: "País africano com três capitais e famoso pelo apartheid.",
            continent: "África"
        },
        {
            country: "Egito",
            image: "imagens_paises/egypt.svg",
            hint: "País africano famoso pelas pirâmides e pelo Rio Nilo.",
            continent: "África"
        },
        {
            country: "Nigéria",
            image: "imagens_paises/nigeria.svg",
            hint: "País mais populoso da África, famoso por Nollywood.",
            continent: "África"
        },
        {
            country: "Quênia",
            image: "imagens_paises/kenya.svg",
            hint: "País africano famoso por suas savanas e vida selvagem.",
            continent: "África"
        },
        {
            country: "Marrocos",
            image: "imagens_paises/morocco.svg",
            hint: "País do norte da África famoso por Casablanca e Marrakech.",
            continent: "África"
        }
    ],
    medium: [
        {
            country: "Suécia",
            image: "imagens_paises/sweden.svg",
            hint: "País nórdico conhecido pela IKEA e pelos prêmios Nobel.",
            continent: "Europa"
        },
        {
            country: "Coreia do Sul",
            image: "imagens_paises/coreia_do_sul.svg",
            hint: "País asiático famoso pelo K-pop e pela tecnologia Samsung.",
            continent: "Ásia"
        },
        {
            country: "Holanda",
            image: "imagens_paises/paises_baixos.svg",
            hint: "País europeu famoso pelas tulipas e pelos moinhos de vento.",
            continent: "Europa"
        },
        {
            country: "Suíça",
            image: "imagens_paises/switzerland.svg",
            hint: "País alpino neutro, conhecido pelos relógios e chocolate.",
            continent: "Europa"
        },
        {
            country: "Singapura",
            image: "imagens_paises/singapore.svg",
            hint: "Cidade-estado asiática conhecida como centro financeiro.",
            continent: "Ásia"
        },
        {
            country: "Noruega",
            image: "imagens_paises/norway.svg",
            hint: "País nórdico famoso pelos fiordes e pelo petróleo.",
            continent: "Europa"
        },
        {
            country: "Chile",
            image: "imagens_paises/chile.svg",
            hint: "País sul-americano longo e estreito, famoso pelo vinho.",
            continent: "América do Sul"
        },
        {
            country: "Tailândia",
            image: "imagens_paises/thailand.svg",
            hint: "País do sudeste asiático conhecido pelos templos budistas.",
            continent: "Ásia"
        },
        {
            country: "África do Sul",
            image: "imagens_paises/africa_do_sul.svg",
            hint: "País africano com três capitais e famoso pelo apartheid.",
            continent: "África"
        },
        {
            country: "Nova Zelândia",
            image: "imagens_paises/nova_zelandia.svg",
            hint: "País oceânico famoso pelas paisagens do Senhor dos Anéis.",
            continent: "Oceania"
        },
        {
            country: "Portugal",
            image: "imagens_paises/portugal.svg",
            hint: "País ibérico que colonizou o Brasil.",
            continent: "Europa"
        },
        {
            country: "Grécia",
            image: "imagens_paises/grecia.svg",
            hint: "Berço da democracia e da filosofia ocidental.",
            continent: "Europa"
        },
        {
            country: "Israel",
            image: "imagens_paises/israel.svg",
            hint: "País do Oriente Médio, Terra Santa para três religiões.",
            continent: "Ásia"
        },
        {
            country: "Finlândia",
            image: "imagens_paises/finland.svg",
            hint: "País nórdico conhecido pela educação e pelas saunas.",
            continent: "Europa"
        },
        {
            country: "Áustria",
            image: "imagens_paises/austria.svg",
            hint: "País alpino famoso pela música clássica e por Mozart.",
            continent: "Europa"
        },
        {
            country: "Turquia",
            image: "imagens_paises/turkey.svg",
            hint: "País transcontinental entre Europa e Ásia, famoso por Istambul.",
            continent: "Ásia"
        },
        {
            country: "Egito",
            image: "imagens_paises/egypt.svg",
            hint: "País africano famoso pelas pirâmides e pelo Rio Nilo.",
            continent: "África"
        },
        {
            country: "Polônia",
            image: "imagens_paises/poland.svg",
            hint: "País da Europa Central, berço de Copérnico e Marie Curie.",
            continent: "Europa"
        },
        {
            country: "Vietnã",
            image: "imagens_paises/viet_nam.svg",
            hint: "País do sudeste asiático famoso pela Guerra do Vietnã.",
            continent: "Ásia"
        },
        {
            country: "Marrocos",
            image: "imagens_paises/morocco.svg",
            hint: "País do norte da África famoso por Casablanca e Marrakech.",
            continent: "África"
        },
        {
            country: "Ucrânia",
            image: "imagens_paises/ukraine.svg",
            hint: "Maior país inteiramente europeu, famoso pelos campos de trigo.",
            continent: "Europa"
        },
        {
            country: "Peru",
            image: "imagens_paises/peru.svg",
            hint: "País sul-americano berço do Império Inca e de Machu Picchu.",
            continent: "América do Sul"
        },
        {
            country: "Indonésia",
            image: "imagens_paises/indonesia.svg",
            hint: "Maior arquipélago do mundo com mais de 17.000 ilhas.",
            continent: "Ásia"
        },
        {
            country: "Nigéria",
            image: "imagens_paises/nigeria.svg",
            hint: "País mais populoso da África, famoso por Nollywood.",
            continent: "África"
        },
        {
            country: "Irlanda",
            image: "imagens_paises/ireland.svg",
            hint: "Ilha esmeralda famosa pelos trevos e pelo Dia de São Patrício.",
            continent: "Europa"
        },
        {
            country: "Bélgica",
            image: "imagens_paises/belgica.svg",
            hint: "País europeu conhecido por suas batatas fritas e chocolates.",
            continent: "Europa"
        },
        {
            country: "Dinamarca",
            image: "imagens_paises/denmark.svg",
            hint: "País escandinavo conhecido pelos contos de fadas de Andersen.",
            continent: "Europa"
        },
        {
            country: "Hungria",
            image: "imagens_paises/hungria.svg",
            hint: "País da Europa Central, famoso por Budapeste e seus banhos termais.",
            continent: "Europa"
        },
        {
            country: "República Tcheca",
            image: "imagens_paises/tchequia.svg",
            hint: "País da Europa Central, conhecido por Praga e suas cervejas.",
            continent: "Europa"
        },
        {
            country: "Irlanda",
            image: "imagens_paises/ireland.svg",
            hint: "Ilha esmeralda famosa pelos trevos e pelo Dia de São Patrício.",
            continent: "Europa"
        },
        // MODIFICAÇÃO: Adicionando mais países ao pool do modo Médio para totalizar 30 bandeiras.
        {
            country: "Bélgica",
            image: "imagens_paises/belgica.svg",
            hint: "País europeu conhecido por suas batatas fritas e chocolates.",
            continent: "Europa"
        },
        {
            country: "Dinamarca",
            image: "imagens_paises/denmark.svg",
            hint: "País escandinavo conhecido pelos contos de fadas de Andersen.",
            continent: "Europa"
        },
        {
            country: "Áustria",
            image: "imagens_paises/austria.svg",
            hint: "País alpino famoso pela música clássica e por Mozart.",
            continent: "Europa"
        },
        {
            country: "Hungria",
            image: "imagens_paises/hungria.svg",
            hint: "País da Europa Central, famoso por Budapeste e seus banhos termais.",
            continent: "Europa"
        },
        {
            country: "Irlanda",
            image: "imagens_paises/ireland.svg",
            hint: "Ilha esmeralda famosa pelos trevos e pelo Dia de São Patrício.",
            continent: "Europa"
        },
        // MODIFICAÇÃO: Adicionando mais países ao pool do modo Médio para totalizar 30 bandeiras.
        {
            country: "Bélgica",
            image: "imagens_paises/belgica.svg",
            hint: "País europeu conhecido por suas batatas fritas e chocolates.",
            continent: "Europa"
        },
        {
            country: "Dinamarca",
            image: "imagens_paises/denmark.svg",
            hint: "País escandinavo conhecido pelos contos de fadas de Andersen.",
            continent: "Europa"
        },
        {
            country: "Áustria",
            image: "imagens_paises/austria.svg",
            hint: "País alpino famoso pela música clássica e por Mozart.",
            continent: "Europa"
        },
        {
            country: "Hungria",
            image: "imagens_paises/hungria.svg",
            hint: "País da Europa Central, famoso por Budapeste e seus banhos termais.",
            continent: "Europa"
        },
        {
            country: "Irlanda",
            image: "imagens_paises/ireland.svg",
            hint: "Ilha esmeralda famosa pelos trevos e pelo Dia de São Patrício.",
            continent: "Europa"
        },
        // MODIFICAÇÃO: Adicionando mais países ao pool do modo Médio para totalizar 30 bandeiras.
        {
            country: "Butão",
            image: "imagens_paises/bhutan.svg",
            hint: "Reino himalaia que mede a Felicidade Nacional Bruta.",
            continent: "Ásia"
        },
        {
            country: "Moldávia",
            image: "imagens_paises/moldavia.svg",
            hint: "Pequeno país europeu entre Romênia e Ucrânia.",
            continent: "Europa"
        },
        {
            country: "Vanuatu",
            image: "imagens_paises/vanuatu.svg",
            hint: "Arquipélago no Pacífico Sul conhecido pelos vulcões ativos.",
            continent: "Oceania"
        },
        {
            country: "Lesoto",
            image: "imagens_paises/lesotho.svg",
            hint: "Reino completamente cercado pela África do Sul.",
            continent: "África"
        },
        {
            country: "Palau",
            image: "imagens_paises/palau.svg",
            hint: "Pequeno país insular no Pacífico, famoso pelos lagos de águas-vivas.",
            continent: "Oceania"
        }
    ],
    hard: [
        {
            country: "Butão",
            image: "imagens_paises/bhutan.svg",
            hint: "Reino himalaia que mede a Felicidade Nacional Bruta.",
            continent: "Ásia"
        },
        {
            country: "Moldávia",
            image: "imagens_paises/moldavia.svg",
            hint: "Pequeno país europeu entre Romênia e Ucrânia.",
            continent: "Europa"
        },
        {
            country: "Vanuatu",
            image: "imagens_paises/vanuatu.svg",
            hint: "Arquipélago no Pacífico Sul conhecido pelos vulcões ativos.",
            continent: "Oceania"
        },
        {
            country: "Lesoto",
            image: "imagens_paises/lesotho.svg",
            hint: "Reino completamente cercado pela África do Sul.",
            continent: "África"
        },
        {
            country: "Palau",
            image: "imagens_paises/palau.svg",
            hint: "Pequeno país insular no Pacífico, famoso pelos lagos de águas-vivas.",
            continent: "Oceania"
        },
        {
            country: "São Tomé e Príncipe",
            image: "imagens_paises/sao_tome_e_principe.svg",
            hint: "Pequeno país insular africano no Golfo da Guiné.",
            continent: "África"
        },
        {
            country: "Kiribati",
            image: "imagens_paises/kiribati.svg",
            hint: "País insular do Pacífico que se estende por quatro fusos horários.",
            continent: "Oceania"
        },
        {
            country: "Andorra",
            image: "imagens_paises/andorra.svg",
            hint: "Microestado nos Pirineus entre França e Espanha.",
            continent: "Europa"
        },
        {
            country: "Comores",
            image: "imagens_paises/comores.svg",
            hint: "Arquipélago no Oceano Índico entre Madagascar e Moçambique.",
            continent: "África"
        },
        {
            country: "Tuvalu",
            image: "imagens_paises/tuvalu.svg",
            hint: "Um dos menores países do mundo, ameaçado pelo aumento do nível do mar.",
            continent: "Oceania"
        },
        {
            country: "Liechtenstein",
            image: "imagens_paises/liechtenstein.svg",
            hint: "Principado alpino entre Suíça e Áustria.",
            continent: "Europa"
        },
        {
            country: "Nauru",
            image: "imagens_paises/nauru.svg",
            hint: "Menor país insular do mundo, no Pacífico Central.",
            continent: "Oceania"
        },
        {
            country: "San Marino",
            image: "imagens_paises/san_marino.svg",
            hint: "Microestado completamente cercado pela Itália.",
            continent: "Europa"
        },
        {
            country: "Seicheles",
            image: "imagens_paises/seychelles.svg",
            hint: "Arquipélago no Oceano Índico famoso pelas praias paradisíacas.",
            continent: "África"
        },
        {
            country: "Brunei",
            image: "imagens_paises/brunei.svg",
            hint: "Sultanato rico em petróleo na ilha de Bornéu.",
            continent: "Ásia"
        },
        {
            country: "Djibouti",
            image: "imagens_paises/djibouti.svg",
            hint: "Pequeno país no Chifre da África, importante porto estratégico.",
            continent: "África"
        },
        {
            country: "Gabão",
            image: "imagens_paises/gabon.svg",
            hint: "País da África Central rico em petróleo e florestas.",
            continent: "África"
        },
        {
            country: "Mônaco",
            image: "imagens_paises/monaco.svg",
            hint: "Principado no Mediterrâneo famoso pelos cassinos e Fórmula 1.",
            continent: "Europa"
        },
        {
            country: "Montenegro",
            image: "imagens_paises/montenegro.svg",
            hint: "País balcânico que se separou da Sérvia em 2006.",
            continent: "Europa"
        },
        {
            country: "Timor-Leste",
            image: "imagens_paises/timor_leste.svg",
            hint: "Jovem nação no Sudeste Asiático que conquistou independência em 2002.",
            continent: "Ásia"
        },
        {
            country: "Eritreia",
            image: "imagens_paises/eritrea.svg",
            hint: "País do Chifre da África que se separou da Etiópia em 1993.",
            continent: "África"
        },
        {
            country: "Belize",
            image: "imagens_paises/belize.svg",
            hint: "Pequeno país centro-americano de língua inglesa.",
            continent: "América do Norte"
        },
        {
            country: "Suriname",
            image: "imagens_paises/suriname.svg",
            hint: "Menor país da América do Sul, ex-colônia holandesa.",
            continent: "América do Sul"
        },
        {
            country: "Islândia",
            image: "imagens_paises/islandia.svg",
            hint: "País nórdico insular famoso pelos gêiseres e vulcões.",
            continent: "Europa"
        },
        {
            country: "Malta",
            image: "imagens_paises/malta.svg",
            hint: "Pequeno arquipélago no Mediterrâneo, ex-colônia britânica.",
            continent: "Europa"
        },
        {
            country: "Luxemburgo",
            image: "imagens_paises/luxembourg.svg",
            hint: "Pequeno país europeu conhecido como paraíso fiscal.",
            continent: "Europa"
        },
        {
            country: "Barbados",
            image: "imagens_paises/barbados.svg",
            hint: "Ilha caribenha que se tornou república em 2021.",
            continent: "América do Norte"
        },
        {
            country: "Fiji",
            image: "imagens_paises/fiji.svg",
            hint: "Arquipélago no Pacífico Sul famoso pelas águas cristalinas.",
            continent: "Oceania"
        },
        {
            country: "Cabo Verde",
            image: "imagens_paises/cabo_verde.svg",
            hint: "Arquipélago africano no Atlântico, ex-colônia portuguesa.",
            continent: "África"
        },
        {
            country: "Maldivas",
            image: "imagens_paises/maldives.svg",
            hint: "Arquipélago no Oceano Índico famoso pelos resorts de luxo.",
            continent: "Ásia"
        },
        {
            country: "Catar",
            image: "imagens_paises/qatar.svg",
            hint: "Pequeno país do Oriente Médio, rico em gás natural.",
            continent: "Ásia"
        },
        {
            country: "Emirados Árabes Unidos",
            image: "imagens_paises/emirados_arabes_unidos.svg",
            hint: "País do Oriente Médio, conhecido por Dubai e Abu Dhabi.",
            continent: "Ásia"
        },
        {
            country: "Arábia Saudita",
            image: "imagens_paises/arabia_saudita.svg",
            hint: "Maior país da Península Arábica, grande produtor de petróleo.",
            continent: "Ásia"
        },
        {
            country: "Filipinas",
            image: "imagens_paises/filipinas.svg",
            hint: "Arquipélago no Sudeste Asiático com mais de 7.000 ilhas.",
            continent: "Ásia"
        },
        {
            country: "Colômbia",
            image: "imagens_paises/colombia.svg",
            hint: "País sul-americano, famoso pelo café e pela diversidade cultural.",
            continent: "América do Sul"
        },
        {
            country: "Venezuela",
            image: "imagens_paises/venezuela.svg",
            hint: "País sul-americano com as maiores reservas de petróleo do mundo.",
            continent: "América do Sul"
        },
        {
            country: "Equador",
            image: "imagens_paises/equador.svg",
            hint: "País sul-americano que leva o nome da linha do equador.",
            continent: "América do Sul"
        },
        {
            country: "Bolívia",
            image: "imagens_paises/bolivia.svg",
            hint: "País sul-americano sem saída para o mar, com o Salar de Uyuni.",
            continent: "América do Sul"
        },
        {
            country: "Paraguai",
            image: "imagens_paises/paraguai.svg",
            hint: "País sul-americano, conhecido pela hidrelétrica de Itaipu.",
            continent: "América do Sul"
        },
        {
            country: "Uruguai",
            image: "imagens_paises/uruguai.svg",
            hint: "Pequeno país sul-americano, famoso pela carne e pelo mate.",
            continent: "América do Sul"
        }
    ]
};

// Pool de países para gerar opções diversificadas
const countryPool = {
    "América do Norte": [
        "Estados Unidos", "Canadá", "México", "Guatemala", "Belize", "Honduras", "El Salvador", 
        "Nicarágua", "Costa Rica", "Panamá", "Cuba", "Jamaica", "Haiti", "República Dominicana", 
        "Barbados", "Trinidad e Tobago", "Bahamas", "Dominica", "Granada", "Santa Lúcia"
    ],
    "América do Sul": [
        "Brasil", "Argentina", "Chile", "Peru", "Colômbia", "Venezuela", "Equador", "Bolívia", 
        "Paraguai", "Uruguai", "Guiana", "Suriname", "Guiana Francesa"
    ],
    "Europa": [
        "França", "Reino Unido", "Alemanha", "Itália", "Espanha", "Portugal", "Holanda", "Bélgica", 
        "Suíça", "Áustria", "Suécia", "Noruega", "Dinamarca", "Finlândia", "Islândia", "Irlanda", 
        "Grécia", "Polônia", "República Tcheca", "Hungria", "Romênia", "Bulgária", "Croácia", 
        "Sérvia", "Montenegro", "Bósnia", "Eslovênia", "Eslováquia", "Ucrânia", "Bielorrússia", 
        "Lituânia", "Letônia", "Estônia", "Rússia", "Moldávia", "Andorra", "Mônaco", "San Marino", 
        "Vaticano", "Liechtenstein", "Malta", "Chipre", "Luxemburgo", "Macedônia do Norte", "Albânia"
    ],
    "Ásia": [
        "China", "Japão", "Coreia do Sul", "Coreia do Norte", "Índia", "Paquistão", "Bangladesh", 
        "Sri Lanka", "Nepal", "Butão", "Maldivas", "Tailândia", "Vietnã", "Camboja", "Laos", 
        "Myanmar", "Malásia", "Singapura", "Indonésia", "Brunei", "Filipinas", "Timor-Leste", 
        "Mongólia", "Cazaquistão", "Quirguistão", "Tadjiquistão", "Turcomenistão", "Uzbequistão", 
        "Afeganistão", "Irã", "Iraque", "Turquia", "Síria", "Líbano", "Jordânia", "Israel", 
        "Palestina", "Arábia Saudita", "Emirados Árabes", "Kuwait", "Catar", "Bahrein", "Omã", "Iêmen"
    ],
    "África": [
        "África do Sul", "Egito", "Nigéria", "Quênia", "Etiópia", "Gana", "Marrocos", "Argélia", 
        "Tunísia", "Líbia", "Sudão", "Sudão do Sul", "Chade", "República Centro-Africana", 
        "Camarões", "Gabão", "República do Congo", "República Democrática do Congo", "Angola", 
        "Zâmbia", "Zimbábue", "Botsuana", "Namíbia", "Lesoto", "Suazilândia", "Moçambique", 
        "Malawi", "Tanzânia", "Uganda", "Ruanda", "Burundi", "Djibouti", "Eritreia", "Somália", 
        "Madagascar", "Maurício", "Seicheles", "Comores", "Cabo Verde", "São Tomé e Príncipe", 
        "Guiné Equatorial", "Guiné", "Guiné-Bissau", "Senegal", "Gâmbia", "Mali", "Burkina Faso", 
        "Costa do Marfim", "Libéria", "Serra Leoa", "Togo", "Benin", "Níger"
    ],
    "Oceania": [
        "Austrália", "Nova Zelândia", "Papua Nova Guiné", "Fiji", "Samoa", "Tonga", "Vanuatu", 
        "Ilhas Salomão", "Palau", "Micronésia", "Ilhas Marshall", "Nauru", "Kiribati", "Tuvalu"
    ]
};

// Dados para modo contrarrelógio (mix de todos os níveis)
quizData.timeattack = [...quizData.easy, ...quizData.medium, ...quizData.hard];

// Estado do jogo
let gameState = {
    currentLevel: 'easy',
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
    questions: [],
    hintUsed: false,
    gameStartTime: null,
    isTimeAttack: false,
    timeAttackDuration: 60,
    currentStreak: 0,
    longestStreak: 0,
    questionStartTime: null,
    responseTimes: [],
    hintsUsedCount: 0,
    usedOptionCombinations: new Set() // Para evitar repetições
};

// Estatísticas persistentes expandidas
let stats = {
    bestScore: parseInt(localStorage.getItem('bestScore')) || 0,
    gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
    totalQuestions: parseInt(localStorage.getItem('totalQuestions')) || 0,
    totalCorrect: parseInt(localStorage.getItem('totalCorrect')) || 0,
    totalHints: parseInt(localStorage.getItem('totalHints')) || 0,
    longestStreak: parseInt(localStorage.getItem('longestStreak')) || 0,
    fastestAnswer: parseFloat(localStorage.getItem('fastestAnswer')) || 999,
    responseTimes: JSON.parse(localStorage.getItem('responseTimes')) || [],
    bestScores: JSON.parse(localStorage.getItem('bestScores')) || {
        easy: 0,
        medium: 0,
        hard: 0,
        timeattack: 0
    },
    continentStats: JSON.parse(localStorage.getItem('continentStats')) || {}
};

// Elementos DOM
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen'),
    stats: document.getElementById('stats-screen')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    updateStatsDisplay();
});

function initializeGame() {
    showScreen('start');
    updateStatsDisplay();
}

function setupEventListeners() {
    // Botões de dificuldade
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.level));
    });

    // Botão de dica
    document.getElementById('hint-btn').addEventListener('click', useHint);

    // Botões da tela de resultado
    document.getElementById('play-again-btn').addEventListener('click', () => startGame(gameState.currentLevel));
    document.getElementById('change-difficulty-btn').addEventListener('click', () => showScreen('start'));
    document.getElementById('share-btn').addEventListener('click', shareResult);

    // Botões de estatísticas
    document.getElementById('view-stats-btn').addEventListener('click', () => showStatsScreen());
    document.getElementById('back-to-menu-btn').addEventListener('click', () => showScreen('start'));
    document.getElementById('reset-stats-btn').addEventListener('click', resetStats);
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startGame(level) {
    gameState.currentLevel = level;
    gameState.currentQuestionIndex = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    gameState.score = 0;
    gameState.gameStartTime = Date.now();
    gameState.currentStreak = 0;
    gameState.responseTimes = [];
    gameState.hintsUsedCount = 0;
    gameState.isTimeAttack = (level === 'timeattack');
    gameState.usedOptionCombinations.clear(); // Limpar combinações usadas
    
    // Configurar perguntas baseadas no nível
    const levelData = quizData[level];
    if (gameState.isTimeAttack) {
        // Modo contrarrelógio: embaralhar todas as perguntas
        gameState.questions = shuffleArray([...levelData]);
        gameState.timeLeft = gameState.timeAttackDuration;
        
        // Adicionar indicador visual
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer && !document.querySelector('.time-attack-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'time-attack-indicator';
            indicator.innerHTML = '<i class="fas fa-clock"></i> MODO CONTRARRELÓGIO - 60 SEGUNDOS!';
            quizContainer.insertBefore(indicator, quizContainer.firstChild);
        }
    } else {
        // Modo normal: selecionar quantidade específica
        // MODIFICAÇÃO: Ajuste no número de perguntas por nível de dificuldade, conforme solicitado.
        // Modo Fácil: 10 perguntas
        // Modo Médio: 15 perguntas
        // Modo Difícil: 20 perguntas
        const questionCount = level === 'easy' ? 10 : level === 'medium' ? 15 : 20;
        gameState.questions = shuffleArray([...levelData]).slice(0, questionCount);
        gameState.timeLeft = 30;
        
        // Remover indicador se existir
        const indicator = document.querySelector('.time-attack-indicator');
        if (indicator) indicator.remove();
    }
    
    showScreen('quiz');
    loadQuestion();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Função para gerar opções de resposta diversificadas e inteligentes
function generateAnswerOptions(correctCountry, correctContinent) {
    const options = [correctCountry];
    const usedCountries = new Set([correctCountry]);
    
    // Obter todos os países disponíveis de todos os continentes
    const allCountries = Object.values(countryPool).flat();
    
    // Estratégia de seleção inteligente
    const strategies = [
        // 1. Países do mesmo continente (mais desafiador)
        () => {
            const sameContinent = countryPool[correctContinent] || [];
            return sameContinent.filter(country => !usedCountries.has(country));
        },
        // 2. Países de continentes vizinhos ou similares
        () => {
            const similarContinents = getSimilarContinents(correctContinent);
            const similarCountries = [];
            similarContinents.forEach(continent => {
                if (countryPool[continent]) {
                    similarCountries.push(...countryPool[continent]);
                }
            });
            return similarCountries.filter(country => !usedCountries.has(country));
        },
        // 3. Países famosos de qualquer continente
        () => {
            const famousCountries = [
                "Estados Unidos", "França", "Reino Unido", "Alemanha", "Japão", "China", 
                "Brasil", "Canadá", "Austrália", "Itália", "Espanha", "Rússia", "Índia"
            ];
            return famousCountries.filter(country => !usedCountries.has(country));
        },
        // 4. Qualquer país disponível
        () => {
            return allCountries.filter(country => !usedCountries.has(country));
        }
    ];
    
    // Gerar 3 opções incorretas
    while (options.length < 4) {
        let candidateFound = false;
        
        // Tentar cada estratégia em ordem
        for (const strategy of strategies) {
            const candidates = strategy();
            if (candidates.length > 0) {
                // Selecionar candidato aleatório
                const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
                if (!usedCountries.has(randomCandidate)) {
                    options.push(randomCandidate);
                    usedCountries.add(randomCandidate);
                    candidateFound = true;
                    break;
                }
            }
        }
        
        // Se não encontrou candidato, usar fallback
        if (!candidateFound) {
            const fallbackCountries = allCountries.filter(country => !usedCountries.has(country));
            if (fallbackCountries.length > 0) {
                const fallback = fallbackCountries[Math.floor(Math.random() * fallbackCountries.length)];
                options.push(fallback);
                usedCountries.add(fallback);
            } else {
                // Último recurso: usar países genéricos
                const genericCountries = ["País A", "País B", "País C", "País D"];
                for (const generic of genericCountries) {
                    if (!usedCountries.has(generic)) {
                        options.push(generic);
                        usedCountries.add(generic);
                        break;
                    }
                }
            }
        }
    }
    
    // Verificar se a combinação já foi usada
    const combinationKey = options.slice().sort().join('|');
    if (gameState.usedOptionCombinations.has(combinationKey)) {
        // Se já foi usada, tentar gerar nova combinação (máximo 3 tentativas)
        if (gameState.usedOptionCombinations.size < 50) { // Evitar loop infinito
            return generateAnswerOptions(correctCountry, correctContinent);
        }
    }
    
    // Adicionar combinação ao conjunto de usadas
    gameState.usedOptionCombinations.add(combinationKey);
    
    return shuffleArray(options);
}

// Função para obter continentes similares ou vizinhos
function getSimilarContinents(continent) {
    const similarities = {
        "América do Norte": ["América do Sul"],
        "América do Sul": ["América do Norte"],
        "Europa": ["Ásia"],
        "Ásia": ["Europa"],
        "África": ["Europa", "Ásia"],
        "Oceania": ["Ásia"]
    };
    
    return similarities[continent] || [];
}

function loadQuestion() {
    if (!gameState.isTimeAttack && gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame();
        return;
    }

    // No modo contrarrelógio, continuar até o tempo acabar
    if (gameState.isTimeAttack && gameState.currentQuestionIndex >= gameState.questions.length) {
        // Reembaralhar perguntas se acabaram
        gameState.questions = shuffleArray([...quizData.timeattack]);
        gameState.currentQuestionIndex = 0;
        gameState.usedOptionCombinations.clear(); // Limpar combinações para nova rodada
    }

    const question = gameState.questions[gameState.currentQuestionIndex];
    gameState.hintUsed = false;
    gameState.questionStartTime = Date.now();

    if (!gameState.isTimeAttack) {
        gameState.timeLeft = 30;
    }

    // Atualizar progresso
    updateProgress();

    // Carregar imagem da bandeira
    document.getElementById('flag-image').src = question.image;

    // Gerar opções de resposta diversificadas
    const options = generateAnswerOptions(question.country, question.continent);
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, question.country));
        optionsContainer.appendChild(button);
    });

    // Resetar dica
    document.getElementById('hint-btn').disabled = false;
    document.getElementById('hint-text').classList.remove('show');
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    // Iniciar timer
    startTimer();
}

function updateProgress() {
    if (gameState.isTimeAttack) {
        // No modo contrarrelógio, mostrar quantas perguntas respondeu
        document.getElementById('progress-text').textContent = `${gameState.correctAnswers + gameState.incorrectAnswers} respondidas`;
        document.getElementById('progress-fill').style.width = '100%';
    } else {
        const current = gameState.currentQuestionIndex + 1;
        const total = gameState.questions.length;
        const percentage = (current / total) * 100;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${current} / ${total}`;
    }
    
    document.getElementById('correct-count').textContent = gameState.correctAnswers;
    document.getElementById('incorrect-count').textContent = gameState.incorrectAnswers;
}

function startTimer() {
    clearInterval(gameState.timer);
    
    const timerElement = document.getElementById('time-left');
    const timerContainer = document.getElementById('timer');
    
    if (gameState.isTimeAttack) {
        timerElement.classList.add('time-attack-timer');
    } else {
        timerElement.classList.remove('time-attack-timer');
    }
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerElement.textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 10) {
            timerContainer.style.color = '#e74c3c';
        } else {
            timerContainer.style.color = '#f39c12';
        }

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            if (gameState.isTimeAttack) {
                endGame();
            } else {
                timeUp();
            }
        }
    }, 1000);
}

function timeUp() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    showFeedback(false, `Tempo esgotado! A resposta correta era: ${question.country}`);
    gameState.incorrectAnswers++;
    gameState.currentStreak = 0;
    
    // Registrar tempo de resposta como máximo
    gameState.responseTimes.push(30);
    
    // Destacar resposta correta
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === question.country) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('neutral');
        }
    });

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function checkAnswer(selectedAnswer, correctAnswer) {
    clearInterval(gameState.timer);
    
    const responseTime = (Date.now() - gameState.questionStartTime) / 1000;
    gameState.responseTimes.push(responseTime);
    
    const isCorrect = selectedAnswer === correctAnswer;
    const buttons = document.querySelectorAll('.answer-btn');
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        } else {
            btn.classList.add('neutral');
        }
    });

    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.currentStreak++;
        
        if (gameState.currentStreak > gameState.longestStreak) {
            gameState.longestStreak = gameState.currentStreak;
        }
        
        let points = 10;
        
        if (!gameState.isTimeAttack) {
            // Bônus por tempo restante (apenas no modo normal)
            points += Math.floor(gameState.timeLeft / 3);
        } else {
            // No modo contrarrelógio, bônus por velocidade
            if (responseTime < 5) points += 5;
            else if (responseTime < 10) points += 3;
            else if (responseTime < 15) points += 1;
        }
        
        // Penalidade por usar dica
        if (gameState.hintUsed) {
            points -= 5;
        }
        
        gameState.score += Math.max(points, 1);
        showFeedback(true, `Correto! +${Math.max(points, 1)} pontos`);
        
        // Atualizar estatísticas de continente
        updateContinentStats(question.continent, true);
    } else {
        gameState.incorrectAnswers++;
        gameState.currentStreak = 0;
        showFeedback(false, `Incorreto! A resposta correta era: ${correctAnswer}`);
        
        // Atualizar estatísticas de continente
        updateContinentStats(question.continent, false);
    }

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function updateContinentStats(continent, isCorrect) {
    if (!stats.continentStats[continent]) {
        stats.continentStats[continent] = { correct: 0, total: 0 };
    }
    
    stats.continentStats[continent].total++;
    if (isCorrect) {
        stats.continentStats[continent].correct++;
    }
}

function useHint() {
    if (gameState.hintUsed) return;
    
    gameState.hintUsed = true;
    gameState.hintsUsedCount++;
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    document.getElementById('hint-text').textContent = question.hint;
    document.getElementById('hint-text').classList.add('show');
    document.getElementById('hint-btn').disabled = true;
    document.getElementById('hint-btn').textContent = 'Dica usada';
}

function showFeedback(isCorrect, message) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
}

function endGame() {
    clearInterval(gameState.timer);
    
    // Atualizar estatísticas gerais
    stats.gamesPlayed++;
    stats.totalQuestions += gameState.correctAnswers + gameState.incorrectAnswers;
    stats.totalCorrect += gameState.correctAnswers;
    stats.totalHints += gameState.hintsUsedCount;
    
    if (gameState.longestStreak > stats.longestStreak) {
        stats.longestStreak = gameState.longestStreak;
    }
    
    // Atualizar melhor pontuação geral e por modo
    if (gameState.score > stats.bestScore) {
        stats.bestScore = gameState.score;
    }
    
    if (gameState.score > stats.bestScores[gameState.currentLevel]) {
        stats.bestScores[gameState.currentLevel] = gameState.score;
    }
    
    // Atualizar tempo de resposta mais rápido
    const fastestThisGame = Math.min(...gameState.responseTimes);
    if (fastestThisGame < stats.fastestAnswer) {
        stats.fastestAnswer = fastestThisGame;
    }
    
    // Salvar tempos de resposta (manter apenas os últimos 100)
    stats.responseTimes = [...stats.responseTimes, ...gameState.responseTimes].slice(-100);
    
    // Salvar no localStorage
    saveStats();

    // Calcular estatísticas do jogo
    const totalQuestions = gameState.correctAnswers + gameState.incorrectAnswers;
    const percentage = totalQuestions > 0 ? Math.round((gameState.correctAnswers / totalQuestions) * 100) : 0;
    
    // Determinar medalha
    let medal = 'bronze';
    let title = 'Bom trabalho!';
    let message = 'Continue praticando para melhorar!';
    
    if (gameState.isTimeAttack) {
        title = 'Contrarrelógio Finalizado!';
        message = `Você respondeu ${totalQuestions} perguntas em 60 segundos!`;
        if (gameState.correctAnswers >= 15) {
            medal = 'gold';
            title = 'Incrível!';
            message = 'Você é muito rápido com as bandeiras!';
        } else if (gameState.correctAnswers >= 10) {
            medal = 'silver';
            title = 'Muito bem!';
            message = 'Boa velocidade e precisão!';
        }
    } else {
        if (percentage >= 90) {
            medal = 'gold';
            title = 'Excelente!';
            message = 'Você é um expert em bandeiras!';
        } else if (percentage >= 70) {
            medal = 'silver';
            title = 'Muito bem!';
            message = 'Você tem um bom conhecimento sobre bandeiras!';
        }
    }

    // Atualizar tela de resultados
    document.getElementById('result-icon').className = `fas fa-trophy result-icon ${medal}`;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('final-correct').textContent = gameState.correctAnswers;
    document.getElementById('final-incorrect').textContent = gameState.incorrectAnswers;
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    document.getElementById('final-score').textContent = gameState.score;

    showScreen('result');
}

function saveStats() {
    localStorage.setItem('bestScore', stats.bestScore);
    localStorage.setItem('gamesPlayed', stats.gamesPlayed);
    localStorage.setItem('totalQuestions', stats.totalQuestions);
    localStorage.setItem('totalCorrect', stats.totalCorrect);
    localStorage.setItem('totalHints', stats.totalHints);
    localStorage.setItem('longestStreak', stats.longestStreak);
    localStorage.setItem('fastestAnswer', stats.fastestAnswer);
    localStorage.setItem('responseTimes', JSON.stringify(stats.responseTimes));
    localStorage.setItem('bestScores', JSON.stringify(stats.bestScores));
    localStorage.setItem('continentStats', JSON.stringify(stats.continentStats));
}

function updateStatsDisplay() {
    document.getElementById('best-score').textContent = stats.bestScore;
    document.getElementById('games-played').textContent = stats.gamesPlayed;
}

function showStatsScreen() {
    // Atualizar estatísticas gerais
    document.getElementById('total-games').textContent = stats.gamesPlayed;
    document.getElementById('total-questions').textContent = stats.totalQuestions;
    document.getElementById('total-correct').textContent = stats.totalCorrect;
    
    const accuracyRate = stats.totalQuestions > 0 ? 
        Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
    document.getElementById('accuracy-rate').textContent = `${accuracyRate}%`;
    
    // Atualizar melhores pontuações
    document.getElementById('best-easy').textContent = stats.bestScores.easy;
    document.getElementById('best-medium').textContent = stats.bestScores.medium;
    document.getElementById('best-hard').textContent = stats.bestScores.hard;
    document.getElementById('best-timeattack').textContent = stats.bestScores.timeattack;
    
    // Atualizar tempo e performance
    const avgTime = stats.responseTimes.length > 0 ? 
        (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(1) : 0;
    document.getElementById('avg-time').textContent = `${avgTime}s`;
    document.getElementById('fastest-answer').textContent = 
        stats.fastestAnswer < 999 ? `${stats.fastestAnswer.toFixed(1)}s` : '0s';
    document.getElementById('longest-streak').textContent = stats.longestStreak;
    document.getElementById('hints-used').textContent = stats.totalHints;
    
    // Atualizar estatísticas por continente
    updateContinentStatsDisplay();
    
    showScreen('stats');
}

function updateContinentStatsDisplay() {
    const container = document.getElementById('continent-stats');
    container.innerHTML = '';
    
    const continents = Object.keys(stats.continentStats);
    if (continents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum dado disponível ainda. Jogue algumas partidas!</p>';
        return;
    }
    
    continents.forEach(continent => {
        const data = stats.continentStats[continent];
        const accuracy = Math.round((data.correct / data.total) * 100);
        
        const card = document.createElement('div');
        card.className = 'continent-card';
        card.innerHTML = `
            <div class="continent-name">${continent}</div>
            <div class="continent-accuracy">${accuracy}%</div>
            <div class="continent-details">${data.correct}/${data.total} corretas</div>
        `;
        container.appendChild(card);
    });
}

function resetStats() {
    if (confirm('Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.')) {
        // Limpar localStorage
        const keysToRemove = [
            'bestScore', 'gamesPlayed', 'totalQuestions', 'totalCorrect', 
            'totalHints', 'longestStreak', 'fastestAnswer', 'responseTimes', 
            'bestScores', 'continentStats'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Resetar objeto stats
        stats = {
            bestScore: 0,
            gamesPlayed: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            totalHints: 0,
            longestStreak: 0,
            fastestAnswer: 999,
            responseTimes: [],
            bestScores: { easy: 0, medium: 0, hard: 0, timeattack: 0 },
            continentStats: {}
        };
        
        // Atualizar displays
        updateStatsDisplay();
        showStatsScreen();
        
        alert('Estatísticas resetadas com sucesso!');
    }
}

function shareResult() {
    const totalQuestions = gameState.correctAnswers + gameState.incorrectAnswers;
    const percentage = totalQuestions > 0 ? Math.round((gameState.correctAnswers / totalQuestions) * 100) : 0;
    
    let text;
    if (gameState.isTimeAttack) {
        text = `Acabei de fazer ${gameState.correctAnswers} acertos em 60 segundos no Modo Contrarrelógio do Quiz de Bandeiras! Pontuação: ${gameState.score} pontos. Você consegue fazer melhor?`;
    } else {
        text = `Acabei de fazer ${gameState.correctAnswers}/${totalQuestions} (${percentage}%) no Quiz de Bandeiras do Mundo! Pontuação: ${gameState.score} pontos. Você consegue fazer melhor?`;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz de Bandeiras do Mundo',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        navigator.clipboard.writeText(text).then(() => {
            alert('Resultado copiado para a área de transferência!');
        }).catch(() => {
            alert('Não foi possível copiar o resultado.');
        });
    }
}
