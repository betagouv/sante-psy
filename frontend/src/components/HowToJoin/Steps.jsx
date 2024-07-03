import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'stores/index';
import styles from './steps.cssmodule.scss';
import {psySteps, studentSteps, doctorSteps} from './stepsData';
import Page from 'components/Page/Page';
import { Accordion, AccordionItem, Row, Col, Button } from "@dataesr/react-dsfr";
import Section from 'components/Page/Section';
import sanitizeHtml from 'sanitize-html';

const Steps = ({type}) => {
  const { commonStore: { config } } = useStore();
  const [ pageSteps, setPageSteps ] = useState({header: {}, steps: []});
  const [ expanded, setExpanded ] = useState(false)

  useEffect(() => {
    document.title = 'Santé Psy Étudiant';

    switch(type) {
      case 'student':
        setPageSteps(studentSteps);
        break;
      case 'psychologist':
        setPageSteps(psySteps);
        break;
      case 'doctor':
        setPageSteps(doctorSteps);
        break;
      default:
        setPageSteps(studentSteps);
    }
    
  }, [type]);

  const accordionHeader = (item) => {
    return (
      <div className={styles.accordionHeader}>
        <div className={styles.stepNumber}>{item.step}</div>
        <div className={styles.stepTitle}>{item.title}</div>
        <img src={"/images/" + item.image} className={styles.stepImage} alt="" />
    </div>
    )
  }

  return (
    <div>
      <Page
        breadCrumbs={[{ href: '/rejoindre', label: 'Rejoindre le dispositif' }]}
        currentBreadCrumb="Psychologues"
        withoutHeader
        //fullWidth
        textContent
        className={styles.page}
    >
      {console.log(pageSteps)}
        <div className={styles.header}>
          <div className={styles.title}>{pageSteps.header.title}</div>
          
          { (pageSteps.header.buttonText && pageSteps.header.buttonImage)  &&
            <div className={styles.headerButton}>
              <img src={"/images/" + pageSteps.header.buttonImage} className={styles.headerImage} alt="avatar" />
              <Button secondary>{pageSteps.header.buttonText}</Button>
            </div>
          }
        </div>
    </Page>

      <div className={styles.accordionContainer}>
        <Accordion className={'fr-mb-4w'}>
          {
            pageSteps.steps.map(item => (
                <AccordionItem
                  title={accordionHeader(item)}
                  key={item.step}
                  className={styles.accordion}
                >
                <p>
                  {item.description}
                </p>
                </AccordionItem>
              ))
          }
        </Accordion>
      </div>
    </div>
    

  );
};

export default observer(Steps);
