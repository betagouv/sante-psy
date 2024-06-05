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
            title: 'Étape 1',
            description: 'Description de l\'étape 1 pour l\'utilisateur A',
            image: 'search.png',
            button: {
                text: 'Action A1',
                icon: 'path/to/icon1.svg'
            }
        },
        {
            step: 2,
            title: 'Étape 2',
            description: 'Description de l\'étape 2 pour l\'utilisateur A',
            image: 'sign-document.png',
            button: {
                text: 'Action A2',
                icon: 'path/to/icon2.svg'
            }
        }
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
                description: 'Vérifier mon éligibilité',
                image: 'search.png',
            },
            {
                step: 2,
                title: 'S\'inscrire en ligne, conventionnement',
                description: 'S\'inscrire en ligne, conventionnement',
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
                description: 'Recevoir les étudiants',
                image: 'human-cooperation.png',
            },
            {
                step: 4,
                title: 'Déclarer les séances et facturer à l\'université',
                description: 'Déclarer les séances et facturer à l\'université',
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
            title: 'Étape 1',
            description: 'Description de l\'étape 1 pour l\'utilisateur B',
            image: 'path/to/image3.jpg',
            button: {
            text: 'Action B1',
            icon: 'path/to/icon3.svg'
            }
        },
        {
            step: 2,
            title: 'Étape 2',
            description: 'Description de l\'étape 2 pour l\'utilisateur B',
            image: 'path/to/image4.jpg',
            button: {
            text: 'Action B2',
            icon: 'path/to/icon4.svg'
            }
        }
    ]
}




export { studentSteps, psySteps, doctorSteps };
  