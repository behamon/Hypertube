/*
 * This file Copyright (C) 2010-2015 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: FilterBarLineEdit.h 14724 2016-03-29 16:37:21Z jordan $
 */

#pragma once

#include <QLineEdit>

class QToolButton;

class FilterBarLineEdit: public QLineEdit
{
    Q_OBJECT

  public:
    FilterBarLineEdit (QWidget * parent = nullptr);

  protected:
    // QWidget
    virtual void resizeEvent (QResizeEvent * event);

  private slots:
    void updateClearButtonVisibility ();

  private:
    QToolButton * myClearButton;
};

