import add from './add.png';
import attackPattern from './attack-pattern.png';
import campaign from './campaign.png';
import coa from './course-of-action.png';
import custom from './custom.png';
import grouping from './grouping.png';
import identity from './identity.png';
import indicator from './indicator.png';
import infrastructure from './infrastructure.png';
import intrusionSet from './intrusion-set.png';
import location from './location.png';
import malwareAnalysis from './malware-analysis.png';
import malware from './malware.png';
import note from './note.png';
import observable from './observable.png';
import observedData from './observed-data.png';
import opinion from './opinion.png';
import playbook from './playbook.png';
import relationship from './relationship.png';
import report from './report.png';
import restrictedMarking from './restricted-marking.png';
import sighting from './sighting.png';
import threatActor from './threat-actor.png';
import tlpAmber from './tlp-amber.png';
import tlpGreen from './tlp-green.png';
import tlpRed from './tlp-red.png';
import tlpWhite from './tlp-white.png';
import tool from './tool.png';
import vulnerability from './vulnerability.png';

export default class Images {
  static images = {
    'add.png': add,
    'attack-pattern.png': attackPattern,
    'campaign.png': campaign,
    'course-of-action.png': coa,
    'custom.png': custom,
    'grouping.png': grouping,
    'identity.png': identity,
    'indicator.png': indicator,
    'infrastructure.png': infrastructure,
    'intrusion-set.png': intrusionSet,
    'location.png': location,
    'malware-analysis.png': malwareAnalysis,
    'malware.png': malware,
    'note.png': note,
    'observable.png': observable,
    'observed-data.png': observedData,
    'opinion.png': opinion,
    'playbook.png': playbook,
    'relationship.png': relationship,
    'report.png': report,
    'restricted-marking.png': restrictedMarking,
    'sighting.png': sighting,
    'threat-actor.png': threatActor,
    'tlp-amber.png': tlpAmber,
    'tlp-green.png': tlpGreen,
    'tlp-red.png': tlpRed,
    'tlp-white.png': tlpWhite,
    'tool.png': tool,
    'vulnerability.png': vulnerability,
  };

  static getImage(img) {
    const { images, } = this;
    if (img in images) {
      return images[img];
    }
    return images['custom.png'];
  }
}
