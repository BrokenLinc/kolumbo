const defaultPosition = { x: 0, y: 0 };

export const convertTextToGraph = (v: string) => {
  if (!v.trim()) {
    return { nodes: [], edges: [] };
  }
  try {
    const object = JSON.parse(v);

    return {
      nodes: object.nodes.map(({ label, ...v }: any) => ({
        ...v,
        position: defaultPosition,
        data: { label },
      })),
      edges: object.edges.map((v: any) => ({ ...v })),
    };
  } catch (e) {
    return { nodes: [], edges: [] };
  }
};
