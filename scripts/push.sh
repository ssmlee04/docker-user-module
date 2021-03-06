#!/usr/bin/env bash

set -ev
echo $BRANCH
echo $GIT_TAG_NAME

# REPO=${GROUP}/${REPO_NAME};
# echo $REPO

if [[ -z "$GROUP" ]] ; then
    echo "Cannot find GROUP env var"
    exit 1
fi

if [[ -z "$COMMIT" ]] ; then
    echo "Cannot find COMMIT env var"
    exit 1
fi

push() {
    DOCKER_PUSH=1;
    while [ $DOCKER_PUSH -gt 0 ] ; do
        echo "Pushing $1";
        docker push $1;
        DOCKER_PUSH=$(echo $?);
        if [[ "$DOCKER_PUSH" -gt 0 ]] ; then
            echo "Docker push failed with exit code $DOCKER_PUSH";
        fi;
    done;
}

tag_and_push_all() {
    if [[ -z "$1" ]] ; then
        echo "Please pass the tag"
        exit 1
    else
        TAG=$1
    fi
    DOCKER_REPO=${GROUP}/${REPO_NAME}
    echo $DOCKER_REPO
    echo $TAG

    if [[ "$COMMIT" != "$TAG" ]]; then
        docker tag ${DOCKER_REPO}:${COMMIT} ${DOCKER_REPO}:${TAG}
    fi
    push "$DOCKER_REPO:$TAG";
}

# Push snapshots whenever possible
BRANCH_TRIMMED=${BRANCH//[\/]/-}
tag_and_push_all ${BRANCH_TRIMMED}-${COMMIT:0:8}

# Push tag and latest when tagged
if [ -n "$GIT_TAG_NAME" ]; then
    tag_and_push_all ${GIT_TAG_NAME}
elif [ "$BRANCH" == "develop" ]; then
    tag_and_push_all latest_dev
elif [ "$BRANCH" == "master" ]; then
    tag_and_push_all latest
fi;
