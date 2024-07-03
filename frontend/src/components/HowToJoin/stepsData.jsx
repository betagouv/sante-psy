import React from 'react';

const studentSteps = {
    header: {
        title: 
        <>
            <h1>Vous êtes <span>étudiant</span></h1> 
            <p>8 séances <span>gratuites</span> avec un psychologue</p>
        </>,
    },
    steps: [
        {
            step: 1,
            title: 'Vérifier mon éligibilité',
            description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique 
            earum ab perferendis voluptatibus est accusantium perferendis cum alias voluptas ab voluptatibus ullam. 
            Et libero modi aut adipisci incidunt aut possimus galisum sit debitis autem vel dolorum voluptas a numquam dignissimos. 
            Non repudiandae internos nam accusantium dolor et nesciunt voluptas ab sequi fugiat.`,
            image: 'search.png',
            button: {
                text: 'Action A1',
                icon: 'path/to/icon1.svg'
            }
        },
        {
            step: 2,
            title: 'S\'inscrire en ligne, conventionnement',
            description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique earum 
            ab perferendis voluptatibus est accusantium perferendis cum alias voluptas ab voluptatibus ullam. 
            Et libero modi aut adipisci incidunt aut possimus galisum sit debitis autem vel dolorum voluptas a numquam dignissimos. 
            Non repudiandae internos nam accusantium dolor et nesciunt voluptas ab sequi fugiat.`,
            image: 'sign-document.png',
            button: {
                text: 'Action A2',
                icon: 'path/to/icon2.svg'
            }
        },
    ]};

    const psySteps =  {
        header: {
            title: 
            <>
                <h1>Psychologues</h1> 
                <p>accompagnez les étudiants</p>
            </>,
            buttonText: 'Connexion',
            buttonImage: 'avatar.png'
        },
        steps: [
            {
                step: 1,
                title: 'Vérifier mon éligibilité',
                description:  `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique`,
                image: 'search.png',
            },
            {
                step: 2,
                title: 'S\'inscrire en ligne, conventionnement',
                description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique, lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique`,
                image: 'sign-document.png',
                button: {
                    text: 'Inscription',
                    icon: 'ri-flashlight-line',
                    link: ''
                }
            },
            {
                step: 3,
                title: 'Recevoir les étudiants',
                description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique, lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique`,
                image: 'human-cooperation.png',
            },
            {
                step: 4,
                title: 'Déclarer les séances et facturer à l\'université',
                description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique, lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique`,
                image: 'document-add.png',
            },
        ]
    }
   

const doctorSteps = {
    header: {
        title: <><h1>Médecin ou SSE,</h1> Comment orienter les étudiants ?</>,
    },
    steps: [
        {
            step: 1,
            title: 'Les orienter vers l\'<b>annuaire</b> des psychologues',
            description: `Lorem ipsum dolor sit amet. In eveniet alias et repellendus praesentium id similique`,
            image: 'path/to/image3.jpg',
            button: {
            text: 'Action B1',
            icon: 'path/to/icon3.svg'
            }
        },
    ]
}




export { studentSteps, psySteps, doctorSteps };
  