import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({
    postArticle,
    updateArticle,
    currentArticleId,
    articles,
    setCurrentArticleId,
}) {
    const [values, setValues] = useState(initialFormValues);

    useEffect(() => {
        if (currentArticleId) {
            const article = articles.find(art => art.article_id === currentArticleId);
            if (article) {
                setValues({ title: article.title, text: article.text, topic: article.topic });
            }
        } else {
            setValues(initialFormValues);
        }
    }, [currentArticleId, articles]);

    const onChange = evt => {
        const { id, value } = evt.target;
        setValues({ ...values, [id]: value });
    };

    const onSubmit = evt => {
        evt.preventDefault();
        if (currentArticleId) {
            updateArticle(currentArticleId, values);
        } else {
            postArticle(values);
        }
        setValues(initialFormValues); 
    };

    const isDisabled = () => {
        return !(values.title.trim().length > 0 && values.text.trim().length > 0 && values.topic.trim().length > 0);
    };

    return (
        <form id="form" onSubmit={onSubmit}>
            <h2>{currentArticleId ? 'Edit Article' : 'Create Article'}</h2>
            <input
                maxLength={50}
                onChange={onChange}
                value={values.title}
                placeholder="Enter title"
                id="title"
            />
            <textarea
                maxLength={200}
                onChange={onChange}
                value={values.text}
                placeholder="Enter text"
                id="text"
            />
            <select onChange={onChange} id="topic" value={values.topic}>
                <option value="">-- Select topic --</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Node">Node</option>
            </select>
            <div className="button-group">
                <button disabled={isDisabled()} id="submitArticle">
                    {currentArticleId ? 'Update' : 'Submit'}
                </button>
                {currentArticleId && (
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentArticleId(null);
                            setValues(initialFormValues);
                        }}
                    >
                        Cancel edit
                    </button>
                )}
            </div>
        </form>
    );
}



// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
