import React, { useState } from "react"
import Details from "./components/Details"
import Template from "./components/Template"
import TemplateDetails from "./components/TemplateDetails"

const NewProject = () => {
  const [template, setTemplate] = useState()
  const [templateDetail, setTemplateDetail] = useState()

  if (templateDetail && template) return <Details setTemplateDetail={setTemplateDetail} template={template} setTemplate={setTemplate} />
  else if (template) return <TemplateDetails setTemplateDetail={setTemplateDetail} template={template} setTemplate={setTemplate} />
  return <Template setTemplate={setTemplate} />
}

export default NewProject
