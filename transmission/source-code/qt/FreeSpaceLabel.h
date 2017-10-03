/*
 * This file Copyright (C) 2013-2016 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: FreeSpaceLabel.h 14732 2016-04-19 20:41:59Z mikedld $
 */

#pragma once

#include <QLabel>
#include <QString>
#include <QTimer>

class Session;

extern "C"
{
  struct tr_variant;
}

class FreeSpaceLabel: public QLabel
{
    Q_OBJECT

  public:
    FreeSpaceLabel (QWidget * parent = nullptr);
    virtual ~FreeSpaceLabel () {}

    void setSession (Session& session);
    void setPath (const QString& folder);

  private slots:
    void onTimer ();

  private:
    Session * mySession;
    QString myPath;
    QTimer myTimer;
};

