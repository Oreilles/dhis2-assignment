export const LEGEND_COLORS = [
    [255, 255, 212, 255],
    [254, 217, 142, 255],
    [254, 153, 41, 255],
    [217, 95, 14, 255],
    [153, 52, 4, 255],
];

export const LEGEND_ITEMS_COUNT = LEGEND_COLORS.length;

export const Legend = ({ min, max }) => {
    const legendStep = (max - min) / LEGEND_ITEMS_COUNT;
    return (
        <>
            <span style={{ fontSize: '1.5em', fontWeight: 500 }}> Value </span>
            <ul>
                {LEGEND_COLORS.map((color, idx) => {
                    const [r, g, b, a] = color;
                    const range = [
                        min + idx * legendStep,
                        min + (idx + 1) * legendStep 
                    ];
                    return (
                        <li key={idx} style={{ display: 'flex', gap: '1ch' }}>
                            <div style={{
                                background: `rgba(${r}, ${g}, ${b}, ${a})`,
                                width: '2ch',
                                height: '1lh',
                            }}>
                            </div>
                            <div>
                                {range[0].toFixed(2)} - {range[1].toFixed(2)}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}
