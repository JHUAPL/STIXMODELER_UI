import {
  BaseEdge, EdgeLabelRenderer, useStore, getBezierPath
} from 'reactflow';

export default function FlowEdge(props) {
  const getPosition = useStore((store) => {
    const siblings = [];
    store.edges.forEach((e) => {
      if ((e.source === props.source || e.source === props.target)
                && (e.target === props.source || e.target === props.target)) {
        siblings.push(e);
      }
    });
    if (siblings.length === 1) return [0, 1];

    siblings.sort();
    const index = siblings.map((e) => e.id).indexOf(props.id);

    return [index, siblings.length];
  });

  const adjustedPosition = (props, position) => {
    const WIDTH = 50;
    let { sourceX, } = props;
    let { sourceY, } = props;
    let { targetX, } = props;
    let { targetY, } = props;
    let source = null;
    let target = null;

    const isRight = (sourceX - targetX) > WIDTH;
    const isLeft = (targetX - sourceX) > WIDTH;
    const isBottom = (sourceY - targetY) > WIDTH;
    const isTop = (targetY - sourceY) > WIDTH;

    // Calculate connection side base on position
    if (isBottom) {
      target = 'bottom';
      targetY = targetY + WIDTH / 2 + 4;
    } else if (isTop) {
      source = 'bottom';
      sourceY = sourceY + WIDTH / 2 + 4;
    }

    if (isLeft) {
      if (source === null) {
        source = 'right';
        sourceX += WIDTH / 2;
      }
      if (target === null) {
        target = 'left';
        targetX -= WIDTH / 2;
      }
    } else if (isRight) {
      if (source === null) {
        source = 'left';
        sourceX -= WIDTH / 2;
      }
      if (target === null) {
        target = 'right';
        targetX += WIDTH / 2;
      }
    } else {
      if (source === null) {
        source = 'top';
        sourceY = sourceY - WIDTH / 2 + 4;
      }
      if (target === null) {
        target = 'top';
        targetY = targetY - WIDTH / 2 + 4;
      }
    }

    // Adjust edge positioning to prevent overlap
    const index = position[0] + 1;
    const partitions = position[1];
    const sectionWidth = WIDTH / partitions;
    const offset = index * sectionWidth - (sectionWidth / 2);
    if (source === 'top' || source === 'bottom') {
      sourceX = (sourceX - WIDTH / 2) + offset;
    } else if (target === 'left' || target === 'right') {
      sourceY = (sourceY - WIDTH / 2) + offset;
    }

    if (target === 'top' || target === 'bottom') {
      targetX = (targetX - WIDTH / 2) + offset;
    } else if (target === 'left' || target === 'right') {
      targetY = (targetY - WIDTH / 2) + offset;
    }

    return {
      sourceX,
      sourceY,
      sourcePosition: source,
      targetX,
      targetY,
      targetPosition: target,
    };
  };

  const getLabel = (props, labelX, labelY) => {
    const yt = props.targetY;
    const ys = props.sourceY;
    const xt = props.targetX;
    const xs = props.sourceX;

    let rotation;
    if (xt === xs) {
      rotation = (yt > ys) ? '90deg' : '-90deg';
    } else {
      rotation = `${Math.atan((yt - ys) / (xt - xs))}rad`;
    }

    return (
      <EdgeLabelRenderer>
        <div
          style={{
            fontSize: '13px',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) rotate(${rotation}) `,
          }}
        >
          {props.label}
        </div>
      </EdgeLabelRenderer>
    );
  };

  const adjusted = adjustedPosition(props, getPosition);
  const [path, labelX, labelY] = getBezierPath(adjusted);
  const label = getLabel(props, labelX, labelY);

  return (
    <>
      <BaseEdge path={path} {...props} markerEnd={props.markerEnd} />
      ;
      {label}
    </>
  );
}
