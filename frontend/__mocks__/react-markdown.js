module.exports = function ReactMarkdownMock(props) {
  return <div>{props.children || props.source}</div>;
};
