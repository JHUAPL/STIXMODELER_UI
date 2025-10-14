import add from '../imgs/add.png';
import attackPattern from '../imgs/attack-pattern.png';
import campaign from '../imgs/campaign.png';
import coa from '../imgs/course-of-action.png';
import custom from '../imgs/custom.png';
import grouping from '../imgs/grouping.png';
import identity from '../imgs/identity.png';
import indicator from '../imgs/indicator.png';
import infrastructure from '../imgs/infrastructure.png';
import intrusionSet from '../imgs/intrusion-set.png';
import location from '../imgs/location.png';
import malwareAnalysis from '../imgs/malware-analysis.png';
import malware from '../imgs/malware.png';
import note from '../imgs/note.png';
import observable from '../imgs/observable.png';
import observedData from '../imgs/observed-data.png';
import opinion from '../imgs/opinion.png';
import playbook from '../imgs/playbook.png';
import relationship from '../imgs/relationship.png';
import report from '../imgs/report.png';
import restrictedMarking from '../imgs/restricted-marking.png';
import sighting from '../imgs/sighting.png';
import threatActor from '../imgs/threat-actor.png';
import tlpAmber from '../imgs/tlp-amber.png';
import tlpGreen from '../imgs/tlp-green.png';
import tlpRed from '../imgs/tlp-red.png';
import tlpWhite from '../imgs/tlp-white.png';
import tool from '../imgs/tool.png';
import vulnerability from '../imgs/vulnerability.png';
import unknown from '../imgs/unknown.png';

export default class {

  static IMAGES = {
    'add.png': add,
    'attack-pattern.png': attackPattern,
    'campaign.png': campaign,
    'course-of-action.png': coa,
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

    'custom.png': custom,
    'unknown.png': unknown
  };

  static getImage(filename) {
    if (filename && filename.includes("blob:")) return filename;
    return this.IMAGES[filename] ?? this.IMAGES['unknown.png'];
  }
}